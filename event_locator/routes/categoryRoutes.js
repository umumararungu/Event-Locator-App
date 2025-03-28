const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Event category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name_key:
 *           type: string
 *           example: "category.music"
 *         icon:
 *           type: string
 *           example: "music-note"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name_key', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_key
 *             properties:
 *               name_key:
 *                 type: string
 *                 example: "category.food"
 *               icon:
 *                 type: string
 *                 example: "utensils"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin (you'll need to implement this check)
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Forbidden: Admin access required' });
    // }

    const { name_key, icon } = req.body;
    
    if (!name_key) {
      return res.status(400).json({ message: 'name_key is required' });
    }

    const category = await Category.create({ name_key, icon });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_key:
 *                 type: string
 *                 example: "category.food_drink"
 *               icon:
 *                 type: string
 *                 example: "utensils"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Forbidden: Admin access required' });
    // }

    const { id } = req.params;
    const { name_key, icon } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name_key) category.name_key = name_key;
    if (icon) category.icon = icon;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Forbidden: Admin access required' });
    // }

    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

module.exports = router;