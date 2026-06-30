package hobbiebackend.service;

import hobbiebackend.model.entities.Category;
import hobbiebackend.model.enums.CategoryNameEnum;

import java.util.List;

public interface CategoryService {
    Category findByName(CategoryNameEnum category);
    List<Category> initCategories();
    List<Category> getAllCategories();
    Category saveCategory(Category category);
    void deleteCategory(Long id);
}