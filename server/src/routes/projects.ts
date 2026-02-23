import { Router, Response } from 'express';
import Project from '../models/Project';
import Event from '../models/Event';
import { authMiddleware } from '../middleware/auth';
import { validateProject } from '../middleware/validate';
import { generateApiKey } from '../utils/generateApiKey';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

router.post('/', validateProject, async (req: AuthRequest, res: Response) => {
  try {
    const { name, domain } = req.body;
    const apiKey = generateApiKey();

    const project = await Project.create({
      name,
      domain,
      apiKey,
      userId: req.userId,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const eventCount = await Event.countDocuments({ projectId: project._id });
        return { ...project.toObject(), eventCount };
      })
    );

    res.json(projectsWithCounts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    await Event.deleteMany({ projectId: project._id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
