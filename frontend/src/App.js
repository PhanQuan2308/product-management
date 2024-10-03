import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const { Column } = Table;
const { Option } = Select;

const App = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    ProductCode: '',
    ProductName: '',
    ProductDate: '',
    ProductOriginPrice: 0,
    Quantity: 0,
    ProductStoreCode: '',
  });
  const [sortOrder, setSortOrder] = useState('descend'); // Sort order state

  // Fetch products from API
  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/api/products');
    setProducts(response.data);
  };

  // Add or edit product
  const handleAddProduct = async () => {
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, newProduct);
        message.success('Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', newProduct);
        message.success('New product added successfully');
      }
      fetchProducts();
      setIsModalVisible(false);
      setEditingProduct(null);
    } catch (error) {
      message.error('Failed to save product');
    }
  };

  // Handle edit button
  const handleEditProduct = (product) => {
    const formattedDate = new Date(product.ProductDate).toISOString().slice(0, 10); // Format date
    setEditingProduct(product);
    setNewProduct({
      ProductCode: product.ProductCode,
      ProductName: product.ProductName,
      ProductDate: formattedDate, // Set date in YYYY-MM-DD format
      ProductOriginPrice: product.ProductOriginPrice,
      Quantity: product.Quantity,
      ProductStoreCode: product.ProductStoreCode,
    });
    setIsModalVisible(true);
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  // Change sorting order by ProductStoreCode
  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Product Manage</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginRight: '10px' }}>
            Add Product
          </Button>
          <Select defaultValue="descend" style={{ width: 200 }} onChange={handleSortChange}>
            <Option value="ascend">Sort by Scode (Ascending)</Option>
            <Option value="descend">Sort by Scode (Descending)</Option>
          </Select>
        </div>
      </div>

      <Table
        dataSource={products.sort((a, b) => {
          if (sortOrder === 'ascend') {
            return a.ProductStoreCode.localeCompare(b.ProductStoreCode);
          }
          return b.ProductStoreCode.localeCompare(a.ProductStoreCode);
        })} // Sort by ProductStoreCode based on sortOrder
        rowKey="_id"
        style={{ marginTop: 20 }}
      >
        <Column title="Product Code" dataIndex="ProductCode" key="ProductCode" />
        <Column title="Product Name" dataIndex="ProductName" key="ProductName" />
        <Column title="Product Date" dataIndex="ProductDate" key="ProductDate" render={(date) => new Date(date).toLocaleDateString()} />
        <Column title="Origin Price" dataIndex="ProductOriginPrice" key="ProductOriginPrice" />
        <Column title="Quantity" dataIndex="Quantity" key="Quantity" />
        <Column title="Store Code" dataIndex="ProductStoreCode" key="ProductStoreCode" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <>
              <Button type="link" onClick={() => handleEditProduct(record)}>
                Edit
              </Button>
              <Button type="link" danger onClick={() => handleDeleteProduct(record._id)}>
                Delete
              </Button>
            </>
          )}
        />
      </Table>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        visible={isModalVisible}
        onOk={handleAddProduct}
        onCancel={() => { setIsModalVisible(false); setEditingProduct(null); }}
      >
        <Form layout="vertical">
          <Form.Item label="Product Code">
            <Input
              value={newProduct.ProductCode}
              onChange={(e) => setNewProduct({ ...newProduct, ProductCode: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Product Name">
            <Input
              value={newProduct.ProductName}
              onChange={(e) => setNewProduct({ ...newProduct, ProductName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Product Date">
            <Input
              type="date"
              value={newProduct.ProductDate}
              onChange={(e) => setNewProduct({ ...newProduct, ProductDate: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Origin Price">
            <Input
              type="number"
              value={newProduct.ProductOriginPrice}
              onChange={(e) => setNewProduct({ ...newProduct, ProductOriginPrice: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Quantity">
            <Input
              type="number"
              value={newProduct.Quantity}
              onChange={(e) => setNewProduct({ ...newProduct, Quantity: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Store Code">
            <Input
              value={newProduct.ProductStoreCode}
              onChange={(e) => setNewProduct({ ...newProduct, ProductStoreCode: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
