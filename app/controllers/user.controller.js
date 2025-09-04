import { User } from "../../models/user.model.js";

/**
 * @route GET /api/users/all-users
 * @description Get all users (for sending invitations)
 * @access Private (add appropriate authentication middleware)
 */
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding sensitive information like passwordHash
    const users = await User.find({}, { name: 1, email: 1, _id: 1 });
    
    res.status(200).json({
      success: true,
      data: users,
      message: 'Users fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};
