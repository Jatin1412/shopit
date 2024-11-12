import mongoose from "mongoose";

export const databaseConnect = () => {
   let DB_URI = ""
   
   if(process.env.NODE_ENV === 'DEVELOPMENT') DB_URI = process.env.DB_URI_LOCAL;
   if(process.env.NODE_ENV === 'PRODUCTION') DB_URI = process.env.DB_URI;

   mongoose.connect(DB_URI).then((con) => {
    console.log(`mongodb is connected to ${con?.connection?.host} !`);
   });
   
}