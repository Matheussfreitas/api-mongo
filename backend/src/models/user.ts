import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    name: string;
    age: number;
    email: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;