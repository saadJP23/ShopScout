import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from "expo-image-picker";

const CreateProduct = () => {
  const navigation = useNavigation();
  const BASE_URL = "https://api.shopscout.org";
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    product_unique_id: uuidv4(),
    product_id: "",
    title: "",
    price: "",
    description: "",
    category: "",
    season: "",
    brand: "",
    sizes: [{ size: "", units: "" }],
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const handleChange = (name, value) => {
    setProduct({ ...product, [name]: value });
  };

  const handleSizeChange = (index, name, value) => {
    const updatedSizes = [...product.sizes];
    updatedSizes[index][name] = value;
    setProduct({ ...product, sizes: updatedSizes });
  };

  const addSizeRow = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, { size: "", units: "" }],
    });
  };

  const removeSizeRow = (index) => {
    const updatedSizes = product.sizes.filter((_, i) => i !== index);
    setProduct({ ...product, sizes: updatedSizes });
  };

  const handleUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      setLoading(true);
      const uploadedImages = [];
      const previewUrls = [];

      for (const asset of result.assets) {
        const uri = asset.uri;
        const type = `image/${uri.split(".").pop()}`;
        const name = `file.${uri.split(".").pop()}`;
        const formData = new FormData();
        formData.append("file", { uri, type, name });

        try {
          const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
            headers: { "content-type": "multipart/form-data" },
          });
          uploadedImages.push(res.data);
          previewUrls.push(res.data.url);
        } catch (err) {
          alert("Image upload failed");
          console.error(err);
          setLoading(false);
          return;
        }
      }
      setImages([...images, ...uploadedImages]);
      setImagePreview([...imagePreview, ...previewUrls]);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/products`, {
        ...product,
        images,
      });

      alert("Product created!");
      setCallback((prev) => !prev);
      navigation.navigate("Home"); // Assuming you have a 'Home' route
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Creating product...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product ID"
        value={product.product_id}
        onChangeText={(text) => handleChange("product_id", text)}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={product.title}
        onChangeText={(text) => handleChange("title", text)}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={product.price}
        onChangeText={(text) => handleChange("price", text)}
        keyboardType="numeric"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={product.brand}
        onChangeText={(text) => handleChange("brand", text)}
        required
      />
      <TextInput
        style={styles.textArea}
        placeholder="Short description"
        multiline
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
        required
      />

      <Text style={styles.subtitle}>Sizes and Units</Text>
      {product.sizes.map((item, index) => (
        <View key={index} style={styles.sizeUnitRow}>
          <View style={styles.selectContainer}>
            <Text>Size:</Text>
            <TouchableOpacity style={styles.selectBox}>
              <Text>{item.size || "Select Size"}</Text>
            </TouchableOpacity>
            {/* Consider using a Picker component for a better select experience */}
            <TextInput
              style={styles.sizeInput}
              placeholder="Size"
              value={item.size}
              onChangeText={(text) => handleSizeChange(index, "size", text)}
              required
            />
          </View>
          <View style={styles.unitContainer}>
            <Text>Units:</Text>
            <TextInput
              style={styles.unitInput}
              placeholder="Units"
              value={item.units}
              onChangeText={(text) => handleSizeChange(index, "units", text)}
              keyboardType="numeric"
              required
            />
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeSizeRow(index)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addSizeRow}>
        <Text style={styles.addButtonText}>+ Add Size</Text>
      </TouchableOpacity>

      <View style={styles.selectContainer}>
        <Text>Category:</Text>
        {/* Consider using a Picker component for a better select experience */}
        <TextInput
          style={styles.selectBox}
          placeholder="Select Category"
          value={product.category}
          onChangeText={(text) => handleChange("category", text)}
          required
        />
      </View>

      <View style={styles.selectContainer}>
        <Text>Season:</Text>
        {/* Consider using a Picker component for a better select experience */}
        <TextInput
          style={styles.selectBox}
          placeholder="Select Season"
          value={product.season}
          onChangeText={(text) => handleChange("season", text)}
          required
        />
      </View>

      <Button title="Upload Images" onPress={handleUpload} />
      {imagePreview.length > 0 && (
        <View style={styles.previewGrid}>
          {imagePreview.map((url, idx) => (
            <Image key={idx} source={{ uri: url }} style={styles.previewImage} />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  sizeUnitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  selectContainer: {
    marginBottom: 10,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    minWidth: 150,
  },
  sizeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 5,
  },
  unitContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  unitInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
  removeButton: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 5,
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateProduct;