import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle } from "../services/api";
import { Link } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Box
} from "@mui/material";
import { getAllCategory, getArticleByCategory } from "../services/api"; 

//
// ArticleList component
//

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategoryIds.length === 0) {
      fetchArticles(); // All articles
    } else {
      fetchArticlesByCategories();
    } 
    fetchCategories();
  }, [selectedCategoryIds]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategory();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories.");
    }
  };

  const fetchArticlesByCategories = async () => {
    try {
      setIsLoading(true);
      const allResults = await Promise.all(
        selectedCategoryIds.map((id) => getArticleByCategory(id))
      );
      const mergedArticles = allResults.flat();
      setArticles(mergedArticles);
    } catch (err) {
      setError("Failed to load filtered articles.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles(); // refresh the list
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <FormControl sx={{ m: 2, width: 300 }}>
        <InputLabel>Filter by Categories</InputLabel>
        <Select
          multiple
          value={selectedCategoryIds}
          onChange={(e) => setSelectedCategoryIds(e.target.value)}
          input={<OutlinedInput label="Filter by Categories" />}
          renderValue={(selected) =>
            categories
              .filter((cat) => selected.includes(cat.id))
              .map((cat) => cat.name)
              .join(", ")
          }
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              <Checkbox checked={selectedCategoryIds.includes(category.id)} />
              <ListItemText primary={category.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author"> 
        By <Link to={`/journalists/${article.journalist_id}/articles`}>
           {article.journalist_name}
        </Link>
      </div>
      <div className="article-category">{article.category_name}</div>

      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
