const { sequelize, User, Geofence, Point } = require("../../../models");
const models = require("../../../models");

// const createGeoPoints = async (coordinates, geofenceId) => {
//   try {
//     var newCoordinates = coordinates[0].map((x) => ({
//       lng: x[0],
//       lat: x[1],
//       geofenceId,
//     }));

//     let createPoints = await Point.bulkCreate(newCoordinates);

//     return createPoints?.length;
//   } catch (e) {
//     console.error(e);
//     throw new Error(e);
//   }
// };
// ////CREATE GEOFENCE/////
// exports.createGeofence = async (
//   title,
//   description = null,
//   userId,
//   isActive = 1,
//   ttGeoId,
//   coordinates
// ) => {
//   try {
//     const query = `INSERT INTO geofences (title, description, userId, isActive, ttGeoId) VALUES (:title, :description, :userId, :isActive, :ttGeoId);`;
//     const data = await sequelize.query(query, {
//       replacements: {
//         title,
//         description,
//         userId,
//         isActive,
//         ttGeoId,
//       },
//       type: sequelize.QueryTypes.INSERT,
//     });
//     if (data[1] === 1) {
//       let pointsAdded = await createGeoPoints(coordinates, data[0]);
//       return pointsAdded
//         ? { code: 0, data: { id: data[0] } }
//         : { code: 1, data: "geofence added but failed to insert points" };
//     } else {
//       return { code: 1, data: "failed to add geofence" };
//     }
//   } catch (e) {
//     console.error(e);
//     throw new Error(e);
//   }
// };
////GET ALL GEOFENCE////
exports.getRequestedUsers = async () => {
  try {
    const data = await models.GeofenceRequest.findAll({
      attributes: ["id", "userId", "geofenceId", "isAccepted"],
      include: [
        { model: models.User, attributes: ["id", "name", "roleId"] },
        { model: models.Geofence, attributes: ["id", "title"] },
      ],
    });
    // console.log(data, "dataGeoeeeee");
    if (data.length > 0) {
      return { code: 0, data };
    } else if (data.length === 0) {
      return { code: 0, data };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.acceptRequest = async (userId, isAccepted, geofenceId) => {
  console.log(userId, isAccepted, geofenceId, "===========");
  try {
    let request = await models.GeofenceRequest.findOne({
      where: {
        userId,
        geofenceId,
      },
    });
    // console.log(request, "userrrrrrrrr");
    if (!request) return null;
    const result = await models.GeofenceRequest.update(
      {
        isAccepted: !request["dataValues"].isAccepted,
      },
      {
        where: {
          userId,
          geofenceId,
        },
      }
    );
    console.log(result, "resulttttttte");
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.createRequest = async (geofenceId, userId) => {
  try {
    let [result, created] = await models.GeofenceRequest.findOrCreate({
      where: {
        userId,
        geofenceId,
      },
      defaults: {
        geofenceId,
        userId,
      },
    });
    if (created) {
      return { code: 0, data: "request created" };
    } else {
      return { code: 1, data: "you have a request already exists" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
// exports.getGeofence = async (id, userId) => {
//   try {
//     const query = `SELECT
//       t.ttGeoId,
//       t.title,
//       t.description,
//       t.isActive,
//       t.createdAt,
//       u.username,
//       u.roleId
//   FROM
//       geofences t
//           JOIN
//       users u ON t.userId = u.id
//   WHERE
//       t.userId = :userId AND t.id = :id
//           AND t.deletedAt IS NULL;`;
//     const data = await sequelize.query(query, {
//       replacements: {
//         userId,
//         id,
//       },
//       type: sequelize.QueryTypes.SELECT,
//     });
//     if (data.length > 0) {
//       return { code: 0, data: data };
//     } else if (data.length === 0) {
//       return { code: 1, data: "geofence not found" };
//     }
//   } catch (e) {
//     console.error(e);
//     throw new Error(e);
//   }
// };

// exports.updateGeofence = async (
//   id,
//   userId,
//   title,
//   geoCenterLat,
//   geoCenterLng
// ) => {
//   try {
//     let query = `UPDATE geofences
//       SET
//           title = :title,
//           geoCenterLat = :geoCenterLat,
//           geoCenterLng = :geoCenterLng
//       WHERE
//           id = :id AND userId = :userId;`;
//     const data = await sequelize.query(query, {
//       replacements: {
//         id,
//         userId,
//         title,
//         geoCenterLat,
//         geoCenterLng,
//       },
//       type: sequelize.QueryTypes.UPDATE,
//     });
//     if (data[1] === 1) {
//       return { code: 0, data: "geofence updated" };
//     } else {
//       return { code: 1, data: "failed to update geofence" };
//     }
//   } catch (e) {
//     console.error(e);
//     throw new Error(e);
//   }
// };

// exports.deleteGeofence = async (id, userId) => {
//   try {
//     let query = `UPDATE geofences
//       SET
//             isActive = 0 ,
//           deletedAt = now()
//       WHERE
//           id = :id AND userId = :userId;`;
//     const data = await sequelize.query(query, {
//       replacements: {
//         id,
//         userId,
//       },
//       type: sequelize.QueryTypes.UPDATE,
//     });
//     if (data[1] === 1) {
//       return { code: 0, data: "geofence deleted" };
//     } else {
//       return { code: 1, data: "failed to delete geofence" };
//     }
//   } catch (e) {
//     console.error(e);
//     throw new Error(e);
//   }
// };
