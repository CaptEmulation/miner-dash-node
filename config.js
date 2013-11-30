exports.config = {
   nodeType: 'server',
   miner: {
      executable: 'bfgminer',
      arguments: [ '-T'],
      options: {
         path: undefined,
         env: process.env
      }
   }
};