export default function authCheck(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: 'Not authorized' });
  return next();
}
