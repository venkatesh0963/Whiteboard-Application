# PaintCraft - Real-Time Collaborative Whiteboard

PaintCraft is a powerful, real-time collaborative whiteboard application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO. It offers an MS Paint-like experience in the browser with advanced layer management, customizable shapes, and real-time syncing across multiple users.

## 🌟 Features

*   **Real-time Collaboration:** Multiple users can draw on the same board simultaneously using Socket.IO.
*   **Rich Drawing Tools:**
    *   Pencil (Freehand drawing)
    *   Eraser
    *   Shapes (Rectangle, Circle)
    *   Lines
    *   Tables (Customizable rows & columns)
    *   Text Input
*   **Advanced Object Manipulation:**
    *   Select tool to move, resize, and edit existing shapes.
    *   Instantly resize shapes after drawing using drag handles.
*   **Layers Panel:**
    *   Reorder objects (Bring Forward / Send Backward).
    *   Delete individual layers.
    *   **Properties Inspector:** Manually enter exact numerical values for X, Y, Width, Height, Border Radius, Rows, and Columns for absolute precision.
*   **Customizable Styles:** Change stroke colors, fill colors, stroke width, and stroke style (solid, dashed, dotted, dash-dot).
*   **Dashboard & Persistence:** Create multiple boards, view recent boards, delete boards, and automatically save canvas states to a MongoDB database.
*   **Undo / Redo:** Full history tracking to easily revert or reapply changes.
*   **Export:** Download your masterpiece directly as a PNG image.

## 🚀 Tech Stack

### Frontend
*   **React (Vite):** Fast, modern frontend framework.
*   **Tailwind CSS (v4):** Utility-first styling for a beautiful, responsive UI.
*   **HTML5 Canvas API:** High-performance drawing engine.
*   **Zustand:** Lightweight global state management.
*   **Socket.IO Client:** For seamless real-time WebSocket communication.
*   **React Router DOM:** Client-side routing.
*   **Lucide React:** Modern SVG icon library.

### Backend
*   **Node.js & Express.js:** Robust server environment and routing.
*   **MongoDB & Mongoose:** NoSQL database for storing board metadata and complex JSON element arrays.
*   **Socket.IO:** Real-time event-based communication server.

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local instance or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/venkatesh0963/Whiteboard-Application.git
cd Whiteboard-Application
```

### 2. Setup the Backend Server
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory and add your MongoDB connection string:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/whiteboard_db
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend Client
Open a new terminal window and navigate to the client folder:
```bash
cd client
npm install
```
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

The application will now be running at `http://localhost:5173`.

## 🎨 How to Use
1.  **Create a Board:** Click "New Board" on the Dashboard.
2.  **Draw:** Select a tool from the left toolbar and draw on the canvas.
3.  **Edit Shapes:** Select a shape on the canvas or from the Layers Panel on the right to resize it or change its precise dimensions using the properties inspector.
4.  **Collaborate:** Copy the URL of your board and share it with a friend. Any drawing they make will instantly appear on your screen!

## 📄 License
This project is open-source and available under the MIT License.
