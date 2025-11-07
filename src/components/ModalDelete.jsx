import React from 'react';

const Modal = ({ isOpen, onClose, onExecute, title, description }) => {
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-bg-secondary p-6 rounded-lg">
                <h2 className="text-xl mb-4 text-text-primary">{title}</h2>
                <p className="mb-6 text-text-secondary">{description}</p>

                <div className="flex gap-4">
                    <button
                        onClick={onExecute}
                        className="w-full bg-purple-primary text-white py-2 px-4 rounded-md cursor-pointer "
                    >
                        Delete
                    </button>
                    <button
                        className="w-full bg-bg-secondary border border-line text-red-400 py-2 px-4 rounded-md cursor-pointer hover:bg-bg-secondary-hover"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;