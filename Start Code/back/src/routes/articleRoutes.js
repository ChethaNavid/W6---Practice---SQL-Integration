import { Router } from "express";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, getAllArticleByJournalistID } from "../controllers/articleController.js";

const articleRouter = Router();
articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);

const articleByJournalistRouter = Router();
articleByJournalistRouter.get("/:id/articles", getAllArticleByJournalistID)

export {articleRouter, articleByJournalistRouter};
