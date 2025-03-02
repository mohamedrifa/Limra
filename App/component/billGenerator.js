import React, { useState } from 'react';
import { View, Alert, Text, TouchableOpacity, Platform, PermissionsAndroid, StyleSheet, Image } from 'react-native';
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
    const customPath = `${RNFS.ExternalStorageDirectoryPath}/Documents/Limra`; 
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
    Alert.alert('PDF Saved', `Location: ${customPath}`);
    setPdfPath(newFilePath);
    return newFilePath;
  };
  const cachePDF = async () => {
    const customPath = `${RNFS.CachesDirectoryPath}/Documents`; 
    const dirExists = await RNFS.exists(customPath);
    if (!dirExists) {
      await RNFS.mkdir(customPath);
    }
    const htmlContent = bill(customerId, customer, billItems, billTotals);
    const options = {
      html: htmlContent,
      fileName: 'invoice' + customerId,
      pageSize: 'A4',
      directory: customPath,
    };
    const file = await RNHTMLtoPDF.convert(options);
    setPdfPath(file.filePath);
    return file.filePath;
  };

  const sharePDF = async () => {
    let path = pdfPath;
    if (!pdfPath) {
      path = await cachePDF();
    }
    if (path) {
      await Share.open({ url: `file://${path}` });
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
    (item, index) => {
      if (item.particulars.toLowerCase() === "discount"){
        return(
          `<tr>
            <td colspan="4" class="table" style="font-weight: 700; font-family: 'Poppins'; font-size: 14px; color: #993333;">Discount</td>
            <td id="custom-total" style="text-align: right;">${item.total}</td>
          </tr>`
        )
      }
      else {
        return(
          `<tr>
            <td>${index + 1}</td>
            <td style="text-align: left;">${item.particulars}</td>
            <td>${item.rate}</td>
            <td>${item.qty}</td>
            <td style="text-align: right;">${item.total}</td>
          </tr>`
        )
      }
    }
  )
  .join('');
  try{
    return `
<!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Invoice</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap&family=Quantico:wght@400&display=swap" rel="stylesheet">
      <style>
          body {
              background-color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .container {
              width: 100%;
              background: white;
          }
          .title {
              width: 150px;
              height: 32.28;
              display:grid;
              margin: -15px auto;
              margin-top: 7.87px;
          }
          .invoiceText {
              font-family: 'Poppins';
              font-size: 12px;
              font-weight: 300;
              margin-top: 37px;
              color: #22223B;
              text-align: center;
          }
          .DateIdContainer {
              margin-top: 22px;
          }
          .DateIdText {
              width: 100%;
              height: 10px;
              text-align: right;
              font-family: 'Poppins';
              font-size: 14px;
              font-weight: 400;
              color: #22223B;
          }
          .customerDetails {
              height: 62px;
              margin-bottom: 20px;
          }
          .customerName {
              font-family: 'Poppins';
              height: 14px;
              font-weight: 600;
              font-size: 14px;
              margin-left: 18px;
              color: #22223B;
          }
          .customerService {
              font-family: 'Poppins';
              font-weight: 600;
              height: 12px;
              margin-left: 18px;
              font-size: 12;
              color: #22223B;
          }
          .customerMobile {
              font-family: 'Quantico';
              font-weight: 700;
              height: 12px;
              font-size: 12;
              margin-left: 18px;
              color: #22223B;
          }
          .table {
              width: 100%;
              border-collapse: collapse;
              border-color: #22223B;
          }
          .table th{
              border: 1px solid #22223B;
              font-family: 'Poppins';
              font-size: 14px;
              font-weight: 600;
              padding-top: 8px;
              padding-bottom: 8px;
              text-align: center;
          } 
          .table td {
              border: 1px solid #22223B;
              padding: 8px;
              text-align: center;
          }
          .technicianName {
              width: 100%;
              text-align: right;
              font-family: 'Poppins';
              font-size: 16px;
              font-weight: 600;
              color: #22223B;
          }
          .technicianNo {
              width: 105px;
              height: 69px;
              font-family: 'Quantico';
              font-size: 16px;
              margin-left: 44px;
              line-height: 22.88px;
              font-weight: 700;
              color: #053412;
          }
          .technicianMail {
              font-family: 'Poppins';
              font-size: 11px;
              font-weight: 600;
              color: #22223B;
          }
          .addressPassage {
              text-align: center;
              width: 177px; 
              font-family: 'Poppins';
              font-weight: 700;
              font-size: 16px;
              color: #22223B;
          }
          .servicesPassage {
              text-align: center;
              width: 100%; 
              max-width: 466px;
              height: 48px;
              font-family: 'Poppins';
              font-weight: 700;
              font-size: 16px;
              color: #22223B;
              margin-bottom: 4px;
              margin-left: auto;
              margin-right: auto;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <p class="invoiceText"><u>Invoice</u></p>
          <img src="data:image/png;base64,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" class="title" alt="LOGO"/>
          <p class="servicesPassage"><i>AC/Washing Machine/Refrigerator/Microwave/water Purifier & All Brand Services</i></p>
          <div style="display: flex; flex-direction: row; width: 100%; height: 69px; justify-content: space-between; align-items: center;">
            <p class="technicianNo"><i>9092443584 8270388290 9094711256</i></p>
            <p class="addressPassage"><i>NO 2, Bharathi Street, Kuthalam 609801</i></p>
            <p class="technicianMail"><i>Email: Shahathul@gmail.com</i></p>
          </div>
          <div style="width: 100%; height: 0.5px; background-color: #22223B; margin: 5px 0;"></div>
          <div style="padding-left: 53px; padding-right: 52px;">
            <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between; align-items: center; margin-bottom: 23px;">
                <div class="customerDetails">
                    <p style="font-size: 16px; margin-left: -20px; font-family: 'Poppins'; font-weight: 600; height: 16px;">To</p>
                    <p class="customerName">${customer.name}</p>
                    <p class="customerService">${customer.serviceType}</p>
                    <p class="customerMobile">${customer.mobile}</p>
                </div>
                <div class="DateIdContainer">
                    <p class="DateIdText">Bill no : ${customerId}</p>
                    <p class="DateIdText">Date : ${customer.date}</p>
                </div>
            </div>
            <div style="height: 40px;"></div>
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
                        <td colspan="4" class="table" style="font-weight: 700; font-family: 'Poppins'; font-size: 14px; color: #22223B;">Total</td>
                        <td id="custom-total" style="text-align: right;">${billTotals.customTotal}</td>
                    </tr>
                </tfoot>
            </table>
            <p class="technicianName">Shahathul Ameen</p>
          </div>
      </div>
  </body>
  </html>
    `;
  }catch(error){
    console.log('Error during PDF creation:', err);
  }
};


const styles = StyleSheet.create({
  container: {
    height: 21,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  downloadButton: {
    width: '48%',
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
    width: '48%',
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
