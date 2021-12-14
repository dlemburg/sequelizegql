const HealthResolver = {
  Query: {
    health: async () => {
      return {
        ok: true,
        date: new Date().toISOString(),
      };
    },
  },
};

export default HealthResolver;
