import { v4 as uuidv4 } from 'uuid';
const generateUid = (type) => {
    return type + uuidv4();
};
export default generateUid;