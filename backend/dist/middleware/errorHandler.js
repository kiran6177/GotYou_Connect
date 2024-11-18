export const errorHandler = async (err, req, res, next) => {
    console.log("ERROR HANDLER :", err);
    res
        .status(err.statusCode || 500)
        .json({ error: err.reasons || err.message || "Something Went Wrong!!" });
};
