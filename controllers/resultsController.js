const Results = require('../model/Results'); // Ensure this path is correct
const { spawn } = require('child_process');
const path = require('path');

// 1. Process Results, update or new entry
exports.processResult = async (req, res) => {
    try {
        const { studentName, examTitle, score } = req.body;
        
        let resultRecord = await Results.findOne({ 
            studentName: studentName, // Fixed case sensitivity
            examTitle: examTitle 
        });

        if (resultRecord) {
            if (resultRecord.score !== score) {
                resultRecord.score = score;
                await resultRecord.save();
                console.log(`Updated score for ${studentName}`);
            }
        } else {
            resultRecord = new Results({
                studentName: studentName, // Fixed case sensitivity
                examTitle: examTitle,
                score: score
            });
            await resultRecord.save();
            console.log(`Created new score for ${studentName}`);
        }
        res.status(200).json({ message: "Exam processed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing exam" });
    }
};

// 2. Send Results for Bayesian 
exports.sendResults = async (req, res) => {
    try {
        const { studentName } = req.query; 

        if (!studentName) {
            return res.status(400).json({ error: "Student name is required." });
        }

        // FETCH with Sort
        const records = await Results.find({ studentName: studentName })
                                     .sort({ _id: 1 }) 
                                     // WE ADDED 'examTitle' to the select statement!
                                     .select('score examTitle -_id') 
                                     .lean();

        if (records.length === 0) {
            return res.status(404).json({ error: "No score evidence found." });
        }

        // FORMAT: Convert the database records into an object Python can read easily
        // E.g., {"A/S Fluency": 2, "Multiplication Facts": 0}
        const scoreEvidence = {};
        records.forEach(record => {
            // Because we sorted by _id chronologically, if a student retook a test, 
            // the newer score will safely overwrite the older score in this object!
            scoreEvidence[record.examTitle] = record.score; 
        });

        // SHARE: Execute the Python script and pass the JSON string
        const scriptPath = path.join(__dirname, '../math_bn_diagnostic/BayesianProcess.py'); 
        const pythonProcess = spawn('python3', [scriptPath, JSON.stringify(scoreEvidence)]);

        let pythonOutput = "";
        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });
        
        // Added error logging for Python crashes
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "Bayesian script failed." });
            }
            
            try {
                // Safely parse the JSON to prevent Node from crashing
                const analysisResult = JSON.parse(pythonOutput.trim());
                
                res.status(200).json({
                    sharedWithBayesian: studentName,
                    evidencePoints: scoreEvidence.length,
                    analysisResult: analysisResult            
                });
            } catch (err) {
                console.error("Failed to parse Python output:", pythonOutput);
                res.status(500).json({ error: "Malformed data from Python" });
            }
        });

    } catch (error) {
        console.error("Sharing Error:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};