import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { removeArticle, getArticleByJournalist } from "../services/api";

const JournalistArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { journalistId } = useParams();
    const [journalistName, setJournalistName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(journalistId) {
            fetchArticleByJournalist(journalistId);
        }
    }, [journalistId]);

    // const fetchArticles = async () => {
    //     setIsLoading(true);
    //     setError("");
    //     try {
    //     const data = await getArticles();
    //     setArticles(data);
    //     } catch (err) {
    //     setError("Failed to load articles. Please try again.");
    //     } finally {
    //     setIsLoading(false);
    //     }
    // };

    const fetchArticleByJournalist = async (journalistId) => {
        setIsLoading(true);
        setError("");
        try {
        const data = await getArticleByJournalist(journalistId);
        setArticles(data);
        if (data.length > 0) {
          setJournalistName(data[0].journalist_name);
        }
        } catch (err) {
        setError("Failed to load articles. Please try again.");
        } finally {
        setIsLoading(false);
        }
    }

    const deleteArticle = async (id) => {
        setIsLoading(true);
        setError("");
        try {
        await removeArticle(id);
        await fetchArticleByJournalist(journalistId); // refresh the list
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
      <header>
        <h2>{journalistName}</h2>
      </header>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
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
      <div className="article-author">By {article.journalist_name}</div>

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

export default JournalistArticleList