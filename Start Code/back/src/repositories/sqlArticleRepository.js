//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//
import pool from "../utils/database.js";

// Get all articles
export async function getArticles() {
    // TODO
    try {
        const [rows] = await pool.query(
            `SELECT a.*, j.name AS journalist_name
             FROM articles a
             INNER JOIN journalists j ON a.journalist_id = j.id
            `
        );
        return rows;
    } catch (error) {
        console.error(error);
    }
}

// Get articles with joined journalist name 
export async function getArticlesWithJournalist(id) {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, j.name AS journalist_name
             FROM articles a 
             LEFT JOIN journalists j ON a.journalist_id = j.id 
             WHERE j.id = ?
            `
            , [id]
        );
        return rows;
    } catch (error) {
        console.error(error);
    }
}

// Get one article by ID
export async function getArticleById(id) {
    // TODO
    try {
        const [rows] = await pool.query(
            `SELECT a.*, j.name AS journalist_name
             FROM articles a
             INNER JOIN journalists j ON a.journalist_id = j.id
             WHERE a.id = ?
            `, [id]
        );
        return rows[0];
    } catch (error) {
        console.error(error);
    }
}

// Create a new article
export async function createArticle(article) {
    // TODO
    const { title, content, journalist, category} = article;

    try {
        const [rows] = await pool.query(
            'INSERT INTO articles(title, content, journalist, category) VALUES (?, ?, ?, ?)',
            [title, content, journalist, category]
        );
        return {id: rows.insertId, ...article};
    } catch (error) {
        console.error(error);
    }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    // TODO
    const {title, content, journalist, category} = updatedData;
    try {
        const [rows] = await pool.query(
            `UPDATE articles
            SET 
                title = ?,
                content = ?,
                journalist = ?,
                category = ?
            WHERE id = ?`, 
            [
                [title, content, journalist, category, id]
            ]
        );

        return { affectedRows: rows.affectedRows };
    } catch (error) {
        console.error(error);
    }
}

// Delete an article by ID
export async function deleteArticle(id) {
    // TODO
    try {
        const [rows] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
        return { affectedRows: rows.affectedRows };
    } catch(error) {
        console.error(error);
    }
}
