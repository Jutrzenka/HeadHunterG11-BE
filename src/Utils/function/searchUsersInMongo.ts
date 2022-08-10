import { JsonCommunicationType } from '../types/data/JsonCommunicationType';

interface searchUser {
  role: string;
  limit: number;
  page: number;
  filter: string | undefined;
}

export const searchUsersInMongo = async (
  { role, limit, page, filter }: searchUser,
  userModel,
): Promise<JsonCommunicationType> => {
  let elements;
  let countElements;
  if (!filter) {
    countElements = await userModel.find({ role }).countDocuments().exec();
    elements = await userModel
      .find({ role }, null, {
        limit,
        skip: limit * (page - 1),
      })
      .exec();
  } else {
    countElements = await userModel
      .find(
        { $and: [{ role }, { $or: [{ email: filter }, { login: filter }] }] },
        null,
        {
          limit,
          skip: limit * (page - 1),
        },
      )
      .countDocuments()
      .exec();
    elements = await userModel
      .find(
        { $and: [{ role }, { $or: [{ email: filter }, { login: filter }] }] },
        null,
        {
          limit,
          skip: limit * (page - 1),
        },
      )
      .exec();
  }
  return {
    success: true,
    typeData: 'array',
    data: {
      info: {
        elements: countElements,
        pages: Math.ceil(countElements / limit),
      },
      value: elements,
    },
  };
};
