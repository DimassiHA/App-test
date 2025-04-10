const PersonalDetails = ({ formData, setFormData, nextStep }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <h3>Personal Details</h3>
            <input
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
                value={formData.first_name}
                required
            />
            <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
                value={formData.last_name}
                required
            />
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={formData.username}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
                required
            />
            <button onClick={nextStep}>Next</button>
        </div>
    );
};
