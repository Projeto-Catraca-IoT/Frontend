import React from 'react';
import { useRef } from 'react';

const ModalEdit = ({ isOpen, onClose, onExecute, data }) => {
    const nameRef = useRef()
    const descriptionRef = useRef()
    const valueRef = useRef()

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            value: valueRef.current.value
        };
        onExecute(formData);
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
            <form className="bg-bg-secondary p-6 rounded-lg" onSubmit={handleSubmit}>
                <h2 className="text-xl mb-4 text-text-primary">Secret update</h2>

                <label>Name</label>
                <input
                    ref={nameRef}
                    type="text"
                    className='w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary'
                    defaultValue={data.name}
                />

                <label>Value</label>
                <input
                    ref={valueRef}
                    type="text"
                    className='w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary'
                    defaultValue={data.value}
                />

                <label>Description</label>
                <input
                    ref={descriptionRef}
                    type="text"
                    className='w-full px-3 py-2 bg-bg-secondary text-text-primary border border-line rounded-md focus:outline-none focus:border-purple-secondary'
                    defaultValue={data.description}
                />

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="w-full bg-purple-primary text-white py-2 px-4 rounded-md cursor-pointer"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-bg-secondary border border-line text-red-400 py-2 px-4 rounded-md cursor-pointer hover:bg-bg-secondary-hover"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalEdit;