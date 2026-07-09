import Board from '../models/Board.js';

// @desc    Get all boards
// @route   GET /api/boards
// @access  Public
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find().select('-elements').sort({ updatedAt: -1 }); // exclude elements to keep response light
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get board by ID
// @route   GET /api/boards/:id
// @access  Public
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (board) {
      res.json(board);
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new board
// @route   POST /api/boards
// @access  Public
export const createBoard = async (req, res) => {
  try {
    const { title, createdBy, canvasWidth, canvasHeight } = req.body;
    const board = new Board({
      title: title || 'Untitled Board',
      createdBy: createdBy || 'Anonymous',
      canvasWidth,
      canvasHeight,
      elements: []
    });

    const createdBoard = await board.save();
    res.status(201).json(createdBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Public
export const updateBoard = async (req, res) => {
  try {
    const { title, elements, canvasWidth, canvasHeight } = req.body;
    const board = await Board.findById(req.params.id);

    if (board) {
      board.title = title || board.title;
      if (elements) {
        board.elements = elements;
      }
      board.canvasWidth = canvasWidth || board.canvasWidth;
      board.canvasHeight = canvasHeight || board.canvasHeight;

      const updatedBoard = await board.save();
      res.json(updatedBoard);
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Public
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (board) {
      await board.deleteOne();
      res.json({ message: 'Board removed' });
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
