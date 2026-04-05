const z= require("zod");

const registerValidation= z.object({
name:z.string().min(3, "user Name must be greater than 3 characters").max(50),
email:z.string().email("Please provide a valid email"),
password:z.string().min(6, "Password must be at least 6 characters long")
})

module.exports= registerValidation