package com.inventorymanagement.dto;

import java.math.BigDecimal;

import org.springframework.beans.BeanUtils;
import org.springframework.web.multipart.MultipartFile;

import com.inventorymanagement.model.Product;

public class ProductAddRequest {
	
	private int id;
    private String title;
	private String description;
	private int quantity; // to add or minus product from suppliedQuantity and quantity
    private BigDecimal price;
    private int categoryId;
    private BigDecimal purchasePrice;
    private int supplierId;
    private MultipartFile image;
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public MultipartFile getImage() {
		return image;
	}
	public void setImage(MultipartFile image) {
		this.image = image;
	}
	public int getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}
	
	public BigDecimal getPurchasePrice() {
		return purchasePrice;
	}
	public void setPurchasePrice(BigDecimal purchasePrice) {
		this.purchasePrice = purchasePrice;
	}
	public int getSupplierId() {
		return supplierId;
	}
	public void setSupplierId(int supplierId) {
		this.supplierId = supplierId;
	}
	public static Product toEntity(ProductAddRequest dto) {
		Product entity=new Product();
		BeanUtils.copyProperties(dto, entity, "image", "categoryId");		
		return entity;
	}
	
	
    @Override
	public String toString() {
		return "ProductAddRequest [id=" + id + ", title=" + title + ", description=" + description + ", quantity="
				+ quantity + ", price=" + price + ", categoryId=" + categoryId + ", purchasePrice=" + purchasePrice
				+ ", supplierId=" + supplierId + ", image=" + image + "]";
	}
	public static boolean validateProduct(ProductAddRequest request) {
        if (request.getTitle() == null || request.getDescription() == null || request.getPrice() == null ||
            request.getImage() == null || request.getQuantity() < 0 || request.getCategoryId() == 0 || request.getSupplierId() == 0
            || request.getPurchasePrice() == null) {
            return false;
        }

        // Additional validation logic if needed

        return true;
    }
	
	public static boolean validateUpdateProduct(ProductAddRequest request) {
        if (request.getId() == 0 || request.getTitle() == null || request.getDescription() == null || request.getPrice() == null ||
            request.getImage() == null || request.getCategoryId() == 0 || request.getSupplierId() == 0
            || request.getPurchasePrice() == null) {
            return false;
        }

        // Additional validation logic if needed

        return true;
    }
}
