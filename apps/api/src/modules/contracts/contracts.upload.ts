import multer from 'multer';
import { ApiError } from '../../platform/http/api-error';
import { DOCX_MIME, PDF_MIME } from './contracts.extractor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === PDF_MIME || file.mimetype === DOCX_MIME) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          415,
          'UNSUPPORTED_TYPE',
          'Only .pdf and .docx files are accepted',
        ),
      );
    }
  },
}).single('file');
