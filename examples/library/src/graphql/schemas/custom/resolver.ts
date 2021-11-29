const HealthResolver = {
  Query: {
    customerHealth: async () => {
      return {
        ok: true,
        date: new Date().toISOString(),
      };
    },
  },
};

export default HealthResolver;
