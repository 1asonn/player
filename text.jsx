export default {
    checkGoodsQtyValid() {
      let invalid = false;
      const tableDatas = Form12.modelValue.purchaseReceiveLineCreateReqList;
      invalid = tableDatas.some((item) => {
        return item.qty <= 0
  
      })
      return invalid
    },
    refreshLineNo() {
      const tableDatas = Form12.modelValue.purchaseReceiveLineCreateReqList;
      tableDatas.forEach((item,index) => {
        item.lineNo = index+1
        item.amount = item.price * item.qty
      })
    },
    setEditTableData() {
      const tableDatas = Form12.modelValue.purchaseReceiveLineCreateReqList;
      const packages = Table1.modelValue.selectedRows;
  
      if (!packages.length) {
        Form12.modelValue.purchaseReceiveLineCreateReqList = []
        return
      }
      const data = packages.map(pkg => {
        const selectedPkg = tableDatas.find(selected => selected.skuId === pkg.productSkuId);
        if(selectedPkg) {
          return selectedPkg
        }
        return {
          skuId: pkg.productSkuId,
          skuCode: pkg.skuCode,
          name: pkg.name,
          icon: pkg.icon,
          qty: 1,
          price: pkg.purchasePrice,
          amount: pkg.purchasePrice * 1,
          description: pkg.remark
        };
      });
      Form12.modelValue.purchaseReceiveLineCreateReqList = data
    },
    initTableData(list) {
      const data = []
      list.forEach((item) => {
        data.push({
          ...item,
          name: item.skuName,
        })
      })
      Form12.modelValue.purchaseReceiveLineCreateReqList.length = 0
      Form12.modelValue.purchaseReceiveLineCreateReqList.push(...data)
    },
    setTable1SelectedRows() {
      const tableDatas = Form12.modelValue.purchaseReceiveLineCreateReqList
      if(!tableDatas.length) {
        Table1.modelValue.selectedRows && (Table1.modelValue.selectedRows.length = 0)
        Table1.modelValue.selectedRowKeys && (Table1.modelValue.selectedRowKeys.length = 0)
        return;
      }
      const ids = []
      const data = []
      tableDatas.forEach(item => {
        const {skuId} = item
        data.push({
          productSkuId: skuId,
        }) 
        ids.push(skuId)
      })
      Table1.modelValue.selectedRows.length = 0
      Table1.modelValue.selectedRows.push(...data)
      Table1.modelValue.selectedRowKeys.length = 0
      Table1.modelValue.selectedRowKeys.push(...ids)
    },
  }