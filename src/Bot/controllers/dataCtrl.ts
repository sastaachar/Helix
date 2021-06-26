const data = {
  botstatus: {
    channelId: "123",
    messageId: "123",
  },
  meta: {
    testingParentId: "801712586583965716",
  },
};

export const find = async (collection: string): Promise<unknown> => {
  if (data[collection]) {
    return [data[collection], null];
  }

  return [null, new Error("Collection not found")];
};
