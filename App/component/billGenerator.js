import React, { useState } from 'react';
import { View, Alert, Text, TouchableOpacity, Platform, PermissionsAndroid, StyleSheet } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

export default function BillGenerator({ customerId, customer, billItems, billTotals}) {
  const [pdfPath, setPdfPath] = useState(null);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 30) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // For Android 11+ (Scoped Storage)
  };

  const generatePDF = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      console.log('Storage permission denied');
      return;
    }

    // Use RNFS.DocumentDirectoryPath for app-specific storage
    const customPath = `${RNFS.ExternalDirectoryPath}/Documents/Limra`;  // Updated to use DocumentDirectoryPath
    const dirExists = await RNFS.exists(customPath);
    if (!dirExists) {
      await RNFS.mkdir(customPath);
    }
    const htmlContent = bill(customerId, customer, billItems, billTotals);
    const options = {
      html: htmlContent,
      fileName: 'invoice' + customerId,
      pageSize: 'A4',
    };
    const file = await RNHTMLtoPDF.convert(options);
    const originalPath = file.filePath;
    const newFilePath = `${customPath}/invoice${customerId}.pdf`;
    await RNFS.moveFile(originalPath, newFilePath);
    Alert.alert('PDF Saved', `Location: ${newFilePath}`);
    setPdfPath(newFilePath);
    return newFilePath;
  };

  const sharePDF = async () => {
    let path = pdfPath;
    if (!pdfPath) {
      path = await generatePDF();
    }
    if (path) {
      await Share.open({ url: `file://${path}` });
      Alert.alert('PDF Location', path);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={sharePDF}>
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const bill = (customerId, customer, billItems, billTotals) => {

  const tableRow = billItems
  .map(
    (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td style="text-align: left;">${item.particulars}</td>
        <td>${item.rate}</td>
        <td>${item.qty}</td>
        <td style="text-align: right;">${item.total}</td>
      </tr>`
  )
  .join('');
  try{
    return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Invoice</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400&family=Quantico:wght@400&display=swap" rel="stylesheet">
      <style>
          body {
              background-color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
          .container {
              width: 100%;
              height: 100%;
              padding: 37px;
              background: white;
          }
          .title {
              width: 76px;
              height: 22px;
              display: grid;
              margin: 0 auto;
          }
          .DateIdContainer {
              width: 100%;
              display: flex;
              justify-content: space-between;
              flex-direction: row;
              margin-top: 22px;
          }
          .DateIdText {
              font-family: 'Poppins';
              font-size: 14px;
              font-weight: 400;
              color: #22223B;
          }
          .customerDetails {
              width: 466px;
              height: 174px;
              margin-top: 22px;
              margin-bottom: 20px;
          }
          .customerName {
              font-family: 'Poppins';
              font-weight: 400;
              font-size: 20px;
              color: #22223B;
          }
          .customerData {
              font-family: 'Poppins';
              font-weight: 400;
              font-size: 14;
              color: #22223B;
          }
          .customerMobile {
              font-family: 'Quantico';
              font-weight: 400;
              font-size: 14;
              color: #22223B;
          }
          .table {
              width: 100%;
              font-family: 'Poppins';
              font-size: 14px;
              font-weight: 400;
              border-collapse: collapse;
              border-color: #22223B;
          }
          .table th{
              border: 1px solid #22223B;
              font-family: 'Poppins';
              font-size: 14px;
              font-weight: 400;
              padding-top: 8px;
              padding-bottom: 8px;
              text-align: center;
          } 
          .table td {
              border: 1px solid #22223B;
              padding: 8px;
              text-align: center;
          }
          .technicianView {
              margin-top: 42px;
              justify-content: space-between;
              height: 96px;
              width: 209px;
          }
          .technicianName {
              font-family: 'Poppins';
              font-size: 20px;
              font-weight: 400;
              color: #22223B;
          }
          .technicianNo {
              font-family: 'Quantico';
              font-size: 14px;
              font-weight: 400;
              color: #22223B;
          }
          .technicianAddress {
              font-family: 'Poppins';
              font-size: 16px;
              font-weight: 400;
              color: #22223B;
          }
          .servicesPassage {
              text-align: center;
              width: 100%; 
              max-width: 466px;
              height: 48px;
              font-family: 'Poppins';
              font-weight: 400;
              font-size: 16px;
              margin-top: 22px;
              color: #22223B;
              margin-left: auto;
              margin-right: auto;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="../assets/images/LIMRA.png" class="title" alt="Logo">
          <div class="DateIdContainer">
              <p class="DateIdText">Date : ${customer.date}</p>
              <p class="DateIdText">Bill no : ${customerId}</p>
          </div>
          <div class="customerDetails">
              <p class="customerName">${customer.name}</p>
              <p class="customerData">${customer.city}</p>
              <p class="customerData">${customer.address}</p>
              <p class="customerData">${customer.serviceType}</p>
              <p class="customerMobile">${customer.mobile}</p>
          </div>
          <table class="table">
              <thead>
                  <tr>
                      <th>S.NO</th>
                      <th>Particulars</th>
                      <th>Rate</th>
                      <th>Qty</th>
                      <th>Total</th>
                  </tr>
              </thead>
              <tbody>${tableRow}</tbody>
              <tfoot>
                  <tr>
                      <td colspan="4" class="table">Total</td>
                      <td id="custom-total" style="text-align: right;">${billTotals[0].customTotal}</td>
                  </tr>
              </tfoot>
          </table>
          <div class="technicianView">
              <p class="technicianName">Shahathul Ameen</p>
              <p class="technicianNo">9092443584</p>
              <p class="technicianAddress">Bharathi Street, Kuttalam</p>
          </div>
          <p class="servicesPassage">AC/Washing Machine/Refrigerator/Microwave/water Purifier & All Brand Services</p>
      </div>
  </body>
  </html>`;
  }catch(error){
    console.log('Error during PDF creation:', err);
  }
};


const styles = StyleSheet.create({
  container: {
    height: 21,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadButton: {
    width: 93,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22223B',
    marginTop: 10,
  },
  downloadText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 600,
    color: '#4A4E69',
  },
  shareButton: {
    width: 116,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22223B',
    marginTop: 10,
  },
  shareText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 600,
    color: '#FFFFFF',
  },
});
