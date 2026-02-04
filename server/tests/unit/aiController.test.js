
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume } from '../../controllers/aiController.js';
import ai from '../../configs/ai.js';
import Resume from '../../models/Resume.js';

vi.mock('../../configs/ai.js', () => ({
  default: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

vi.mock('../../models/Resume.js', () => ({
  default: {
    create: vi.fn(),
  },
}));

describe('AI Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      userId: 'test-user-id',
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  describe('enhanceProfessionalSummary', () => {
    it('should return 400 if userContent is missing', async () => {
      req.body.userContent = '';

      await enhanceProfessionalSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should return 200 and enhanced content on success', async () => {
      req.body.userContent = 'I am a developer.';
      const mockEnhancedContent = 'Experienced Developer with a passion for coding.';

      ai.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: mockEnhancedContent,
            },
          },
        ],
      });

      await enhanceProfessionalSummary(req, res);

      expect(ai.chat.completions.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ enhancedContent: mockEnhancedContent });
    });
    
    it('should return 400 on API error', async () => {
        req.body.userContent = 'content';
        const errorMessage = 'API Error';
        
        ai.chat.completions.create.mockRejectedValue(new Error(errorMessage));
        
        await enhanceProfessionalSummary(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('enhanceJobDescription', () => {
      it('should return 400 if userContent is missing', async () => {
          req.body.userContent = '';
          await enhanceJobDescription(req, res);
          expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should return 200 with enhanced content', async () => {
          req.body.userContent = 'Did stuff';
          const mockResponse = 'Delivered high impact stuff.';
          
          ai.chat.completions.create.mockResolvedValue({
              choices: [{ message: { content: mockResponse } }]
          });

          await enhanceJobDescription(req, res);
          
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ enhancedContent: mockResponse });
      });
  });

  describe('uploadResume', () => {
      it('should bucket fields and create resume', async () => {
           req.body = {
               resumeText: "Raw resume text",
               title: "My Resume"
           };
           
           const mockParsedData = {
               professional_summary: "Summary",
               skills: ["JS"],
               personal_info: { full_name: "John" },
               experience: [],
               project: [],
               education: []
           };
           
           // Mock the AI response for parsing
           ai.chat.completions.create.mockResolvedValue({
               choices: [{ message: { content: JSON.stringify(mockParsedData) } }]
           });
           
           // Mock DB Create
           Resume.create.mockResolvedValue({
               _id: 'new-resume-id',
               ...mockParsedData
           });

           await uploadResume(req, res);

           expect(ai.chat.completions.create).toHaveBeenCalled();
           expect(Resume.create).toHaveBeenCalledWith({
               userId: 'test-user-id',
               title: 'My Resume',
               ...mockParsedData
           });
           expect(res.json).toHaveBeenCalledWith({ resumeId: 'new-resume-id' });
      });

      it('should return 400 if resumeText is missing', async () => {
          req.body = { title: "Test" };
          await uploadResume(req, res);
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
      });
  });
});
