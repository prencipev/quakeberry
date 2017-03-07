const elasticsearch = require('elasticsearch');

/**
 * [createESIndex create an index & mapping]
 * @param  {[type]}   params     [info of the created domain]
 * @param  {Function} next       [callback function]
 * @return {[type]}              [info of the created es domain with index & mapping added]
 */
function createESIndex(next) {

    console.log('Start creating index and mapping...');

    const indexName = 'simulator_index';
    const mappingName = 'simulator_mapping';

    const client = new elasticsearch.Client({
        region: 'eu-west-1',
        host: "http://search-eqsimul-elasti-3oj40uf39t-h6xzwf2obovswx5tvii4hnqqlq.eu-west-1.es.amazonaws.com"
    });

    client.indices.create({
        index: indexName
    }, (err, data) => {
        if (err) {
            if (err.message.indexOf('IndexAlreadyExistsException') > -1) {
                putMapping();
            } else {
                return next(err);
            }
        }
        putMapping();
    });

    function putMapping() {
        var mapping = JSON.parse(
            `{
      "properties": {
        "device_id":    { "type": "sting"  }, 
        "lat":     { "type": "float"  }, 
        "long":      { "type": "float" },
        "status":      { "type": "string" }    
      }
    }`);

        client.indices.putMapping({
            index: indexName,
            type: mappingName,
            body: mapping
        }, (err, date) => {
            if (err) {
                if (err.message.indexOf('AlreadyExists') > -1) {
                    console.log(`Index & mapping creation is done. Index Name: ${indexName}. Mapping Name: ${mappingName}`);
                    return next(null);
                } else {
                    return err;
                }
            } else {
                console.log(`Index & mapping creation is done. Index Name: ${indexName}. Mapping Name: ${mappingName}`);
                return null;
            }
        });
    }
}

module.exports = createESIndex;