import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import Modal from './Modal'; // Import the Modal component
import ModalConfirmation from './ModalConfirmation';

function EditReward() {
    const API_URL = 'https://eurbin.vercel.app/rewards';

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [rewardId, setRewardId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [Reward, setRewards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [modalTitle, setModalTitle] = useState('Add Reward');
    const [isEditing, setIsEditing] = useState(false); // New state to differentiate between adding and editing


    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    const [isConfirmationAddModalOpen, setIsConfirmationAddModalOpen] = useState(false);
    
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
    const [hoverAdd, setHoverAdd] = useState(false);
    const [hoverEdit, setHoverEdit] = useState(false);

    

    const location = useLocation();  

    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchReward(); 
    }, []); // Run only once on component mount
    
    const fetchReward = async () => {
        try {
            console.log('Fetching rewards...');
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });
    
            if (response.status === 200 && Array.isArray(response.data.rewards)) {
                setRewards(response.data.rewards);
                console.log('Rewards fetched successfully:', response.data.rewards);
            } else {
                console.error('Unexpected data format:', response.data);
                alert('An error occurred: Unexpected data format');
            }
        } catch (err) {
            console.error('Error fetching rewards:', err);
            alert('An error occurred while fetching rewards');
        }
    };
    

    const createReward = async () => {
        try {
            console.log('Creating reward with data:', { name, category, quantity, price, selectedImage });
            const formData = new FormData();
            formData.append('RewardName', name);
            formData.append('Category', category);
            formData.append('Quantity', parseInt(quantity, 10));
            formData.append('Price', parseFloat(price));
            if (selectedImage) {
                formData.append('Image', selectedImage);
                console.log('Image added to formData:', selectedImage.name);
            }
    
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                    
                }
            });
    
            if (response.status === 201) {
                console.log('Reward created successfully:', response.data);
                await fetchReward();
                clearInput();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error('Error creating reward:', err.response || err);
            alert('An error occurred while creating the reward');
        }
    };
    
    const updateReward = async () => {
        try {
            console.log('Updating reward with ID:', rewardId);
    
            const formData = new FormData();
            formData.append('RewardName', name);
            formData.append('Category', category);
            formData.append('Quantity', parseInt(quantity, 10));
            formData.append('Price', parseFloat(price));
    
            if (selectedImage) {
                formData.append('Image', selectedImage); // Add the selected image if available
                console.log('Image added to formData for update:', selectedImage.name);
            }
    
            const response = await axios.put(`${API_URL}/${rewardId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${token}` 
                }
            });
    
            if (response.status === 200) {
                console.log('Reward updated successfully:', response.data);
                await fetchReward();
                clearInput();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error('Error updating reward:', err.response || err);
            alert('An error occurred while updating the reward');
        }
    };


    const deleteReward = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the headers
                }
            });
    
            if (response.status === 200) {
                await fetchReward(); // Refresh the rewards list after deletion
            }
        } catch (err) {
            console.error('Error deleting reward:', err);
            alert('An error occurred while deleting the reward');
        }
    };

    const handleEditClick = (reward) => {
        setRewardId(reward._id);
        setName(reward.RewardName);
        setCategory(reward.Category);
        setQuantity(reward.Quantity.toString());
        setPrice(reward.Price.toString());
        setModalTitle('Edit Reward'); // Set the modal title to "Edit Reward"
        setIsEditing(true); // Set editing mode
        setIsModalOpen(true); // Open the modal with the data
    };

    const clearInput = () => {
        setName('');
        setCategory('');
        setQuantity('');
        setPrice('');
        setSelectedImage(null);
        setRewardId(null); // Reset rewardId as well
        setIsEditing(false); // Reset editing mode
    }

    const handleAddClick = () => {
        clearInput(); // Clear inputs before adding new reward
        setIsModalOpen(true); // Open modal when "Add" button is clicked
        setModalTitle('Add Reward');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close modal
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'category':
                setCategory(value);
                break;
            case 'quantity':
                setQuantity(value);
                break;
            case 'price':
                setPrice(value);
                break;
            default:
                break;
        }
    };


    const handleImageChange = (file) => {
        console.log('Selected image:', file.name);
        setSelectedImage(file); // Update selected image
    };

    const handleEdit = () => {
        setIsConfirmationModalOpen(true); 
    };

    // confirmation edit modal buttons
    const handleConfirmEdit = () => {
        updateReward();
        setIsConfirmationModalOpen(false); 
    };

    const handleCancelEdit = () => {
        setIsConfirmationModalOpen(false); 
    };


   

    const handleCreateClick = () => {
     // Clear inputs before adding new reward
        setIsConfirmationAddModalOpen(true); 
        setSelectedImage(null);  // Explicitly reset the selected image
    };

    const handleConfirm = () => {
        createReward();  
        setIsConfirmationAddModalOpen(false); 
    };



    const handleCancel = () => {
        setIsConfirmationModalOpen(false); 
        setIsConfirmationAddModalOpen(false); 
    };



    //DELETE 
    const handleDeleteClick = (id) => {
        setIsDeleteConfirmationModalOpen(true);
        setRewardId(id); // Store the reward ID for later deletion
    };
    
    const handleConfirmDelete = () => {
        deleteReward(rewardId);  // Pass the stored reward ID for deletion
        setIsDeleteConfirmationModalOpen(false);
    };
    

    const handleCancelDelete = () => {
        setIsDeleteConfirmationModalOpen(false); // Close the modal without doing anything
    };
    return (
        <>
        <h1 className='headings'>Management</h1>
        
        <nav className="nav">
            <ul className="navList">
            <li >
                <Link to="/Manage" >
                <button className="edit-reward-button">
                        Reward Management
                    </button>
                </Link>
            </li>
            <li >
                <Link to="/Request" >
                <button className={location.pathname === "/Request" ? "active-btn" : "inactive-btn"}>
                        Requesting for Reward
                    </button>
                </Link>
            </li>
            <li >
                <Link to="/Transaction" >
                <button className={location.pathname === "/Transaction" ? "active-btn" : "inactive-btn"}>
                        Transaction
                    </button>
                </Link>
            </li>
            <li >
                <Link to="/Recycleables" >
                <button className={location.pathname === "/Recycleables" ? "active-btn" : "inactive-btn"}>
                        Recycleable Materials Data
                    </button>
                </Link>
            </li>
            </ul>
        </nav>
        
        
        <div className="header-buttons">
            <button
                onClick={handleAddClick}
                className={hoverAdd ? "hButton hButtonHover addButton" : "hButton addButton"}
                onMouseEnter={() => setHoverAdd(true)}
                onMouseLeave={() => setHoverAdd(false)}
            >
                Add
            </button>
            <Link
                to="/Edit"
                className={hoverEdit ? "hButton hButtonHover editButton activityLink" : "hButton editButton activityLink"}
                onMouseEnter={() => setHoverEdit(true)}
                onMouseLeave={() => setHoverEdit(false)}
            >
                Edit
            </Link>
        </div>

        {/* Modal for Add/Edit Reward */}
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={isEditing ? updateReward : createReward}
            formData={{ name, category, quantity, price }}
            onChange={handleChange}
            onImageChange={handleImageChange} // Pass the image change handler
            modalTitle={modalTitle}
        />

           {/* Modal for Add/Edit Reward */}
           <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={isEditing ? handleEdit : handleCreateClick}
            formData={{ name, category, quantity, price }}
            onChange={handleChange}
            onImageChange={handleImageChange} // Pass the image change handler
            modalTitle={modalTitle}
        />

        <ModalConfirmation
            isOpen={isConfirmationModalOpen}
            message="Are you sure you want to edit this reward?"
            onConfirm={handleConfirmEdit}
            onCancel={handleCancelEdit}
        />
        {/* handle edit */}


        <ModalConfirmation
            isOpen={isConfirmationAddModalOpen}
            message="Are you sure you want to create this reward?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />



        <ModalConfirmation
            isOpen={isDeleteConfirmationModalOpen}
            message="Are you sure you want to delete this reward?"
            onConfirm={handleConfirmDelete} 
            onCancel={handleCancelDelete}
        />

        

        <div style={{paddingBottom: '80px'}} className="table-container">
            <table className="w3-table-all">
                <thead>
                    <tr className="w3-light-grey">
                        <th>Reward</th>
                        <th>Reward Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th> Price <div style={{ fontSize: '10px', color: 'black' }}>(Smart Points)</div></th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Reward.map(reward => (
                        <tr key={reward._id}>
                                <td>
                                    <img 
                                        src={reward.Image} 
                                        alt={selectedImage} 
                                        style={{ width: '70px', height: '70px', borderRadius: '10px' }} 
                                    />
                                </td>   
                            <td>{reward.RewardName}</td>
                            <td>{reward.Category}</td>
                            <td>{reward.Quantity}</td>
                            <td>{reward.Price}</td>
                            <td className="rrBtn">
                            <button  style={{ backgroundColor: '#4CAF50' }} onClick={() => handleEditClick(reward)} className="btn-edit">
                                    <i className="fas fa-pencil-alt"></i>
                                </button>
                                <button style={{ backgroundColor: '#F44336' }}  onClick={() => handleDeleteClick(reward._id)} className="btn-delete">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}

export default EditReward;
     