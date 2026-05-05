const multer = require('multer');
const path = require('path');  
const fs = require('fs');

// Create the uploads directory if it doesn't exist
const createUploadsDir = () => {
    const uploadDirs = ['uploads', 'uploads/profiles', 'uploads/resumes', 'uploads/companies'];

    uploadDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// call the function to create directories
createUploadsDir();

// configure the multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        if (file.fieldname === 'profilePicture') {
            uploadPath += 'profiles/';
        } else if (file.fieldname === 'resume') {
            uploadPath += 'resumes/';
        } else if (file.fieldname === 'companyLogo') {
            uploadPath += 'companies/';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// file filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'profilePicture' || file.fieldname === 'companyLogo') {
        // allow only image files for profile pictures and company logos
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for profile pictures and company logos'), false);
        }
    } else if (file.fieldname === 'resume') {
        // allow only PDF files for resumes
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for resumes'), false);
        }
    } else {
        cb(new Error('Invalid field name for file upload'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // limit file size to 5MB
});

module.exports = upload;