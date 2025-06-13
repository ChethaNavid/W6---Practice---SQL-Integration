import { Router } from "express";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, getAllArticleByJournalistID, getAllCategories, getArticleByCategory} from "../controllers/articleController.js";

const articleRouter = Router();
articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);

const articleByJournalistRouter = Router();
articleByJournalistRouter.get("/:id/articles", getAllArticleByJournalistID);

const categoryRouter = Router();
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id/articles", getArticleByCategory);

export {articleRouter, articleByJournalistRouter, categoryRouter};
