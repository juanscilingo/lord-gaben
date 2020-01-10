module.exports.splitArrayInChunks = (arr, chunkSize) => {
  if (chunkSize === 0) return arr;

  return arr.reduce((result, item, index) => { 
    const chunkIndex = Math.floor(index / chunkSize);

    if (!result[chunkIndex]) 
      result[chunkIndex] = [];

    result[chunkIndex].push(item)

    return result
  }, [])
}