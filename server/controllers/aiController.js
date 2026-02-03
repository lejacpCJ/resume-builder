import ai from "../configs/ai.js"
import Resume from "../models/Resume.js";

// Controll for enhancing a resume's professional summay
// POST: /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const {userContent} = req.body;

        if(!userContent) {
            return res.status(400).json({message: 'Missing required fields'});
        }

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: "You are an expert resume strategist. Analyze the provided resume and rewrite the professional summary to be high-impact and ATS-optimized. Instructions: 1. Identify and Prioritize: Extract the user's most senior job title, total years of experience, and top 3 technical skills found in the resume. 2. Structure: Sentence 1: A 'hook' combining years of experience, current title, and core expertise. Sentence 2: A 'value statement' highlighting a specific, measurable achievement or a key career objective clearly supported by the resume's history. 3. Constraint: Keep the total length to 2 sentences maximum. Avoid generic buzzwords like 'passionate,' 'detail-oriented,' or 'motivated'; use action-oriented verbs and concrete data instead. Output: Return only the final summary text. No preamble, no explanation, and no multiple options."
                },
                {
                    role: "user", content: userContent
                }
            ]
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent});


    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const {userContent} = req.body;

        if(!userContent) {
            return res.status(400).json({message: 'Missing required fields'});
        }

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: "Act as an expert career coach and ATS specialist to enhance the user content to a highly optimized, 1-2 sentence professional job description, ensuring the use of industry-standard keywords and a measurable impact-driven tone to maximize recruiter search visibility. Keep the total length to 2 sentences maximum. Avoid generic buzzwords like 'passionate,' 'detail-oriented,' or 'motivated'; use action-oriented verbs and concrete data instead. Output: Return only the final summary text. No preamble, no explanation, and no multiple options."
                },
                {
                    role: "user", content: userContent
                }
            ]
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent});


    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// Controller for uploading a resume to the database
// POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
    try {

        const {resumeText, title} = req.body;
        const userId = req.userId;

        if(!resumeText) {
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = "You are an expert AI agent to extract data from resume"
        const userPrompt = `extract data from this resume: ${resumeText}
        
        Provide data in the following JSON format with no additional text before or after.
        IMPORTANT: All dates (start_date, end_date, graduation_date) MUST be in "YYYY-MM" format (e.g., "2023-05"). If the day is missing, default to 01.
        
        {
            professional_summary: {type: String, default: ''},
            skills: [{type: String}],
            personal_info: {
                image: {type: String, default: ''},
                full_name: {type: String, default: ''},
                email: {type: String, default: ''},
                phone: {type: String, default: ''},
                location: {type: String, default: ''},
                linkedin: {type: String, default: ''},
                website: {type: String, default: ''},
            },
            experience: [
                {
                    company: {type: String},
                    position: {type: String},
                    start_date: "YYYY-MM",
                    end_date: "YYYY-MM",
                    description: {type: String},
                    is_current: {type: Boolean},
                }
            ],
            project: [
                {
                    name: {type: String},
                    type: {type: String},
                    description: {type: String},
                }
            ],
            education: [
                {
                    institution: {type: String},
                    degree: {type: String},
                    field: {type: String},
                    graduation_date: "YYYY-MM",
                    gpa: {type: String},
                }
            ],
        }

        `

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {role: "system",
                    content: systemPrompt
                },
                {role: "user",
                    content: userPrompt
                }
            ],
            response_format: {type: 'json_object'}
        })

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({userId, title, ...parsedData});
        res.json({resumeId: newResume._id});

    } catch (error) {
        
    }
}