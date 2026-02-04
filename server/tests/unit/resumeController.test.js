
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createResume, deleteResume, getResumeById, updateResume } from '../../controllers/resumeController.js';
import Resume from '../../models/Resume.js';
import imagekit from '../../configs/imageKit.js';
import fs from 'fs';

vi.mock('../../models/Resume.js', () => ({
  default: {
    create: vi.fn(),
    findOneAndDelete: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

vi.mock('../../configs/imageKit.js', () => ({
  default: {
    files: {
      upload: vi.fn(),
    },
  },
}));

vi.mock('fs', () => ({
  default: {
    createReadStream: vi.fn(),
  }
}));

describe('Resume Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            userId: 'test-user-id',
            body: {},
            params: {},
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        vi.clearAllMocks();
    });

    describe('createResume', () => {
        it('should create a resume successfully', async () => {
             req.body.title = 'My Resume';
             const mockResume = { _id: '123', title: 'My Resume', userId: 'test-user-id' };
             
             Resume.create.mockResolvedValue(mockResume);

             await createResume(req, res);

             expect(Resume.create).toHaveBeenCalledWith({ userId: 'test-user-id', title: 'My Resume' });
             expect(res.status).toHaveBeenCalledWith(201);
             expect(res.json).toHaveBeenCalledWith({ message: 'Resume created successfully', resume: mockResume });
        });

        it('should return 400 on error', async () => {
            Resume.create.mockRejectedValue(new Error('DB Error'));
            await createResume(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteResume', () => {
        it('should delete resume successfully', async () => {
            req.params.resumeId = '123';
            Resume.findOneAndDelete.mockResolvedValue({}); // Found and deleted

            await deleteResume(req, res);

            expect(Resume.findOneAndDelete).toHaveBeenCalledWith({ userId: 'test-user-id', _id: '123' });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getResumeById', () => {
        it('should return resume if found', async () => {
             req.params.resumeId = '123';
             const mockResume = { 
                 _id: '123', 
                 title: 'Res', 
                 __v: 1, 
                 createdAt: 'date', 
                 updatedAt: 'date' 
             };
             
             Resume.findOne.mockResolvedValue(mockResume);

             await getResumeById(req, res);

             expect(res.status).toHaveBeenCalledWith(200);
             // Should check if it cleaned up fields
             expect(res.json).toHaveBeenCalledWith({ 
                 resume: {
                    _id: '123',
                    title: 'Res',
                    __v: undefined,
                    createdAt: undefined,
                    updatedAt: undefined
                 }
             });
        });

        it('should return 404 if not found', async () => {
            req.params.resumeId = '123';
            Resume.findOne.mockResolvedValue(null);

            await getResumeById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Resume Not Found' });
        });
    });

    describe('updateResume', () => {
        it('should update resume without image', async () => {
            req.body = {
                resumeId: '123',
                resumeData: JSON.stringify({ personal_info: { name: 'New Name' } })
            };

            Resume.findByIdAndUpdate.mockResolvedValue({ _id: '123' });

            await updateResume(req, res);

            expect(Resume.findByIdAndUpdate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should upload image if provided', async () => {
            req.body = {
                resumeId: '123',
                resumeData: JSON.stringify({ personal_info: { image: '' } })
            };
            req.file = { path: 'path/to/img.png' };

            imagekit.files.upload.mockResolvedValue({ url: 'http://img.url' });
            Resume.findByIdAndUpdate.mockResolvedValue({ _id: '123' });

            await updateResume(req, res);

            expect(imagekit.files.upload).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
