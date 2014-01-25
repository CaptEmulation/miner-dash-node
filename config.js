exports.config = {
   nodeType: 'server',
   miner: {
      executable: 'bfgminer',
      arguments: [ '-T'],
      options: {
         path: undefined,
         env: process.env
      }
   },
   pools: [
      {
         type: 'eclipsemc',
         apiKey: '60448e05c2389bf334465e1c17b370'
      },
      {
         type: 'give-me-coins',
         apiKey: '4fa5d5ca3dc0d45262eeb0a87da832eb2572c1c6391684aa3d9ba4ead9b2ad68'
      }
   ]
};