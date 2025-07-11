const adminModel = require("../features/users/admins/admin.model");

 

const checkPermission = (sectionPath, action = "view") => {
  return async (req, res, next) => {
    const partialUser = req.user;

    if (!partialUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🟢 Fetch full admin (include permissions)
    const admin = await adminModel.findOne({ email: partialUser?.email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.role === "main-admin") return next();
    if (admin.permissions?.mainadmin == true) return next();

    if (!admin.isActive) {
      return res.status(403).json({ message: "Sub-admin account is inactive" });
    }

    const path = Array.isArray(sectionPath)
      ? sectionPath
      : sectionPath.split(".");

    let current = admin.permissions;

    for (const key of path) {
      if (typeof current !== "object" || current === null || !(key in current)) {
        return res.status(403).json({
          message: `Permission path '${path.join(".")}' is invalid or not configured`,
        });
      }
      current = current[key];
    }

    if (typeof current === "boolean" && current === true) return next();
    if (typeof current === "object" && current?.all === true) return next();
    if (typeof current === "object" && current?.[action] === true) return next();

    return res.status(403).json({
      message: `Access denied to '${path.join(".")}' for action '${action}'`,
    });
  };
};

module.exports = checkPermission;
