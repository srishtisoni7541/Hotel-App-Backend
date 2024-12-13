const propertyModel=require('../models/property.model');
const customErrors=require('../utils/customErrors');

module.exports.createProperty = async (req, res, next) => {
  const { title, description, location, price, amenities, images } = req.body;

  try {
      // Validate required fields
      if (!title || !description || !location || !price || !amenities || !images) {
          return next(new customErrors("All fields are required!", 400));
      }

      // Convert price to a valid number
      const numericPrice = Number(price.toString().replace(/,/g, ''));
      if (isNaN(numericPrice)) {
          return next(new customErrors("Invalid price format!", 400));
      }

      // Create property
      const property = await propertyModel.create({
          title,
          description,
          location,
          price: numericPrice,
          amenities,
          images,
          host: req.user._id,
      });

      res.status(201).json({ message: "Property created successfully!", property });
  } catch (error) {
      console.error(error);
      next(new customErrors("Error creating property", 500));
  }
};


module.exports.updateProperty = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) {
      return next(new customErrors("Property ID is required", 400));
    }

    // Sanitize the `price` field
    if (req.body.price) {
      const sanitizedPrice = req.body.price.toString().replace(/,/g, ""); // Remove commas
      if (isNaN(sanitizedPrice)) {
        return next(new customErrors("Invalid price format", 400));
      }
      req.body.price = parseFloat(sanitizedPrice); // Convert to a valid number
    }

    const updateProperty = await propertyModel.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true, // Ensures updated values adhere to the schema
      }
    );

    if (!updateProperty) {
      return next(new customErrors("Property not found", 404));
    }

    res
      .status(200)
      .json({ message: "Property updated successfully", updateProperty });
  } catch (error) {
    next(new customErrors("Error updating property", 500));
    console.log(error);
  }
};



  module.exports.deleteProperty = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      if (!id) return next(new customErrors("Property ID is required", 400));
  
      const deleteProperty = await propertyModel.findByIdAndDelete(id);
  
      if (!deleteProperty)
        return next(new customErrors("Property not found", 404));
  
      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
      next(new customErrors("Error deleting property", 500));
    }
  };
  
  module.exports.viewProperty = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!id) return next(new customErrors("Property ID is required", 400));
  
      const property = await propertyModel
        .findById(id)
        .populate("host", "username email");
      console.log(property);
  
      if (!property) return next(new customErrors("Property not found", 404));
  
      res.status(200).json(property);
    } catch (error) {
      next(new customErrors("Error fetching property details", 500));
    }
  };
  
  module.exports.searchMyProperties = async (req, res, next) => {
    console.log(req.user._id);
  
    const properties = await propertyModel.find({ host: req.user._id });
  
    res.status(200).json(properties);
  };
  
  exports.searchProperties = async (req, res, next) => {
    try {
      const { location, minPrice, maxPrice } = req.query;
  
      const query = {
        ...(location && { location: { $regex: location, $options: "i" } }),
        ...(minPrice && { price: { $gte: minPrice } }),
        ...(maxPrice && { price: { $lte: maxPrice } }),
      };
  
      const properties = await propertyModel.find(query);
  
      res.status(200).json(properties);
    } catch (error) {
      next(new customErrors("Error searching for properties", 500));
    }
  };