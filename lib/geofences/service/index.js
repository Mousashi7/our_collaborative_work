const { sequelize, User, Geofence, Point } = require("../../../models");
const models = require("../../../models");

const createGeoPoints = async (coordinates, geofenceId) => {
  try {
    var newCoordinates = coordinates[0].map((x) => ({
      lng: x[0],
      lat: x[1],
      geofenceId,
    }));

    let createPoints = await Point.bulkCreate(newCoordinates);

    return createPoints?.length;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

////CREATE GEOFENCE/////
exports.createGeofence = async (
  title,
  description = null,
  userId,
  isActive = 1,
  ttGeoId,
  coordinates
) => {
  try {
    const query = `INSERT INTO geofences (title, description, userId, isActive, ttGeoId) VALUES (:title, :description, :userId, :isActive, :ttGeoId);`;
    const data = await sequelize.query(query, {
      replacements: {
        title,
        description,
        userId,
        isActive,
        ttGeoId,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    if (data[1] === 1) {
      console.log(coordinates, data[0], "dataCooooooooooorrrrrrrrrrr");
      let pointsAdded = await createGeoPoints(coordinates, data[0]);
      return pointsAdded
        ? { code: 0, data: { id: data[0] } }
        : { code: 1, data: "geofence added but failed to insert points" };
    } else {
      return { code: 1, data: "failed to add geofence" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

//////////GET ALL PUBLIC GEOFENCES///////////////////////////////
exports.getAllGeofences = async (id) => {
  try {
    const data = await models.Geofence.findAll({
      // where: { isActive: 1, deletedAt: null },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "ttGeoId",
          // "isActive",
          "UserId",
          "userId",
          "deletedAt",
          // "coordinates",
          "id",
        ],
      },
    });
    console.log(data, "dataaaaaaaaaaaa");
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

////GET ALL GEOFENCE////

exports.getUserAllGeofences = async (userId) => {
  try {
    const data = await models.Geofence.findAll({
      // where: { userId: userId, deletedAt: null },
      include: [models.User],
    });
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

exports.getGeoByUserId = async (userId, id) => {
  try {
    const data = await models.GeofenceRequest.findAll({
      attributes: ["id"],
      where: { userId: id },
      include: [
        { model: models.User, attributes: ["id", "name", "roleId"] },
        { model: models.Geofence },
      ],
    });
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
//////////////////////////////////////////////////
exports.getGeofence = async (id, userId) => {
  try {
    const query = `SELECT 
      t.ttGeoId,
      t.title,
      t.description,
      t.isActive,
      t.createdAt,
      u.username,
      u.roleId
  FROM
      geofences t
          JOIN
      users u ON t.userId = u.id
  WHERE
      t.userId = :userId AND t.id = :id
          AND t.deletedAt IS NULL;`;
    const data = await sequelize.query(query, {
      replacements: {
        userId,
        id,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    if (data.length > 0) {
      return { code: 0, data: data };
    } else if (data.length === 0) {
      return { code: 1, data: "geofence not found" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

exports.updateAdminGeo = async (id, isActive) => {
  try {
    let request = await models.Geofence.findOne({
      where: {
        id,
      },
    });
    // console.log(request, "userrrrrrrrr");
    if (!request) return null;
    const result = await models.Geofence.update(
      {
        isActive: !request["dataValues"].isActive,
      },
      {
        where: {
          id,
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

/////////////////////////////////////////////////////////////////////
exports.deleteGeofence = async (id, userId) => {
  try {
    let query = `UPDATE geofences 
      SET 
            isActive = 0 ,
          deletedAt = now()
      WHERE
          id = :id AND userId = :userId;`;
    const data = await sequelize.query(query, {
      replacements: {
        id,
        userId,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    if (data[1] === 1) {
      return { code: 0, data: "geofence deleted" };
    } else {
      return { code: 1, data: "failed to delete geofence" };
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

//////////////////////////////////////////////////////////////////////////////////

exports.deactivate = async (geofenceId) => {
  try {
    let geofence = await models.Geofence.findByPk(geofenceId);
    let isActive = geofence.isActive;
    if (!geofence) return null;
    if (isActive == 1) {
      let result = models.Geofence.update(
        {
          isActive: 0,
        },
        {
          where: {
            id: geofenceId,
          },
        }
      );
      return result;
    }
  } catch (err) {
    throw new Error(err);
  }
};

//////////////////////////////////////////////////////////////////////////////

exports.activate = async (geofenceId) => {
  try {
    let geofence = await models.Geofence.findByPk(geofenceId);
    let isActive = geofence.isActive;
    if (!geofence) return null;
    if (isActive == 0) {
      let result = models.Geofence.update(
        {
          isActive: 1,
        },
        {
          where: {
            id: geofenceId,
          },
        }
      );
      return result;
    }
  } catch (err) {
    throw new Error(err);
  }
};
