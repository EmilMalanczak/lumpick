type EmailConfirmationEmailParams = {
  name: string;
  confirmUrl: string;
};

export const emailConfirmationEmailHtml = ({
  name,
  confirmUrl,
}: EmailConfirmationEmailParams) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
 <meta charset="UTF-8" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <!--[if !mso]><! -->
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <!--<![endif]-->
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <meta name="format-detection" content="telephone=no" />
 <meta name="format-detection" content="date=no" />
 <meta name="format-detection" content="address=no" />
 <meta name="format-detection" content="email=no" />
 <meta name="x-apple-disable-message-reformatting" /> 
 <link href="https://fonts.googleapis.com/css?family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900" rel="stylesheet" />
 <link href="https://fonts.googleapis.com/css?family=Sora:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800" rel="stylesheet" />
 <title>Lumpik confirm email</title>
 <style>
 html,
         body {
             margin: 0 !important;
             padding: 0 !important;
             min-height: 100% !important;
             width: 100% !important;
             -webkit-font-smoothing: antialiased;
         }
 
         * {
             -ms-text-size-adjust: 100%;
         }
 
         #outlook a {
             padding: 0;
         }
 
         .ReadMsgBody,
         .ExternalClass {
             width: 100%;
         }
 
         .ExternalClass,
         .ExternalClass p,
         .ExternalClass td,
         .ExternalClass div,
         .ExternalClass span,
         .ExternalClass font {
             line-height: 100%;
         }
 
         div[style*="margin: 14px 0"],
         div[style*="margin: 16px 0"] {
             margin: 0 !important;
         }
 
         table,
         td,
         th {
             mso-table-lspace: 0 !important;
             mso-table-rspace: 0 !important;
             border-collapse: collapse;
         }
 
         body, td, th, p, div, li, a, span {
             -webkit-text-size-adjust: 100%;
             -ms-text-size-adjust: 100%;
             mso-line-height-rule: exactly;
         }
 
         img {
             border: 0;
             outline: none;
             line-height: 100%;
             text-decoration: none;
             -ms-interpolation-mode: bicubic;
         }
 
         a[x-apple-data-detectors] {
             color: inherit !important;
             text-decoration: none !important;
         }
  
         .pc-gmail-fix {
             display: none;
             display: none !important;
         }
 
         @media (min-width: 621px) {
             .pc-lg-hide {
                 display: none;
             } 
 
             .pc-lg-bg-img-hide {
                 background-image: none !important;
             }
         }
 </style>
 <style>
 @media (max-width: 620px) {
 .pc-project-body {min-width: 0px !important;}
 .pc-project-container {width: 100% !important;}
 .pc-sm-hide {display: none !important;}
 .pc-sm-bg-img-hide {background-image: none !important;}
 .pc-w620-padding-30-0 {padding-top: 15px !important;padding-bottom: 15px !important;}
 .pc-w620-padding-40-20-40-20 {padding: 40px 20px 40px 20px !important;}
 table.pc-w620-spacing-0-0-0-0 {margin: 0px 0px 0px 0px !important;}
 td.pc-w620-spacing-0-0-0-0,th.pc-w620-spacing-0-0-0-0{margin: 0 !important;padding: 0px 0px 0px 0px !important;}
 .pc-w620-width-60 {width: 60px !important;}a.pc-w620-width-60 {padding-left: 0 !important; padding-right: 0 !important;}
 .pc-w620-height-auto {height: auto !important;}
 table.pc-w620-spacing-0-0-20-0 {margin: 0px 0px 20px 0px !important;}
 td.pc-w620-spacing-0-0-20-0,th.pc-w620-spacing-0-0-20-0{margin: 0 !important;padding: 0px 0px 20px 0px !important;}
 .pc-w620-padding-0-0-0-0 {padding: 0px 0px 0px 0px !important;}
 .pc-w620-fontSize-32px {font-size: 32px !important;}
 .pc-w620-fontSize-14px {font-size: 14px !important;}
 table.pc-w620-spacing-0-0-32-0 {margin: 0px 0px 32px 0px !important;}
 td.pc-w620-spacing-0-0-32-0,th.pc-w620-spacing-0-0-32-0{margin: 0 !important;padding: 0px 0px 32px 0px !important;}
 .pc-w620-padding-14-32-14-32 {padding: 14px 32px 14px 32px !important;}
 .pc-w620-fontSize-16px {font-size: 16px !important;}
 .pc-w620-padding-32-16-0-16 {padding: 32px 16px 0px 16px !important;}
 .pc-w620-padding-0-20 {padding-left: 10px !important;padding-right: 10px !important;}
 .pc-w620-lineHeight-140pc {line-height: 140% !important;}
 .pc-w620-padding-35-35-35-35 {padding: 35px 35px 35px 35px !important;}
 
 .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
 
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
 
 .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
 }
 @media (max-width: 520px) {
 .pc-w520-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
 }
 </style>
 <!--[if !mso]><! -->
 <style>
 @media all { @font-face { font-family: 'Inter'; font-style: normal; font-weight: 300; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 100; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 200; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 600; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 900; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Inter'; font-style: normal; font-weight: 800; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYAZFhiA.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 300; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmScMnk-DKQI.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 100; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSdSn0-DKQI.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSdSnk-DKQI.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSdgnk-DKQI.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 800; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSfSmU-DKQI.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 200; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSfSnk-DKQI.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 600; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSeMmU-DKQI.woff2') format('woff2'); } @font-face { font-family: 'Sora'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/sora/v12/xMQOuFFYT72X5wkB_18qmnndmSe1mU-DKQI.woff2') format('woff2'); } }
 </style>
 <!--<![endif]-->
 <!--[if mso]>
    <style type="text/css">
        .pc-font-alt {
            font-family: Arial, Helvetica, sans-serif !important;
        }
    </style>
    <![endif]-->
 <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>

<body class="pc-font-alt" style="width: 100% !important;min-height: 100% !important;margin: 0 !important;padding: 0 !important;line-height: 1.5;color: #2D3A41;mso-line-height-rule: exactly;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;font-variant-ligatures: normal;text-rendering: optimizeLegibility;-moz-osx-font-smoothing: grayscale;background-color: #16a3b257;" bgcolor="#16a3b2">
 <table class="pc-project-body" style="table-layout: fixed;min-width: 600px;background-color:#16a3b257;" bgcolor="#16a3b257" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
  <tr> 
   <td align="center" valign="top">
    <table class="pc-project-container" style="width: 600px; max-width: 600px;" width="600" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
     <tr>
      <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Gift Card -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <!--[if !gte mso 9]><! -->
               <td valign="top" class="pc-w620-padding-32-16-0-16" style="background-size: cover; background-position: top left; background-repeat: no-repeat;padding: 64px 24px 24px 24px;border-radius: 20px 20px 0px 0px;background-color: #111747;" bgcolor="#111747" background="https://cloudfilesdm.com/postcards/image-1711995320504.png">
                <!--<![endif]-->
                <!--[if gte mso 9]>
                <td valign="top"  align="center" style="background-size: cover; background-position: top left; background-repeat: no-repeat;background-color: #111747;border-radius: 20px 20px 0px 0px;" bgcolor="#111747" background="https://cloudfilesdm.com/postcards/image-1711995320504.png">
            <![endif]-->
                <!--[if gte mso 9]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 600px;">
                    <v:fill src="https://cloudfilesdm.com/postcards/image-1711995320504.png" color="#111747" type="frame" size="1,1" aspect="atleast" origin="-0.5,-0.5" position="-0.5,-0.5"/>
                    <v:textbox style="mso-fit-shape-to-text: true;" inset="0,0,0,0">
                        <div style="font-size: 0; line-height: 0;">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="font-size: 14px; line-height: 1.5;" valign="top">
                                        <p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tr>
                                                <td colspan="3" height="64" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td width="24" valign="top" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                                <td valign="top" align="left">
                <![endif]-->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td>
                   <table class="pc-width-fill pc-w620-gridCollapsed-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-grid-td-last pc-w620-padding-30-0" align="left" valign="top" style="width: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                       <tr>
                        <td class="pc-w620-padding-40-20-40-20" align="center" valign="middle" style="padding: 60px 40px 60px 40px; mso-padding-left-alt: 0; margin-left:40px;  background-color:#ffffff; border-radius: 20px 20px 20px 20px;">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td class="pc-w620-spacing-0-0-20-0" align="center" valign="top" style="padding: 0px 0px 32px 0px;">
                               <img src="https://cloudfilesdm.com/postcards/image-1711996305972.png" class="pc-w620-width-60 pc-w620-height-auto" width="120" height="120" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:120px;height: auto;max-width: 100%;" />
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                          <tr>
                           <td align="center" valign="top">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td style="padding: 0px 0px 24px 0px;">
                               <table class="pc-width-fill pc-w620-gridCollapsed-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                <tr class="pc-grid-tr-first pc-grid-tr-last">
                                 <td class="pc-grid-td-first pc-grid-td-last pc-w620-padding-30-0" align="left" valign="top" style="width: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                   <tr>
                                    <td align="center" valign="middle">
                                     <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                      <tr>
                                       <td align="center" valign="top">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                         <tr>
                                          <td valign="top" style="padding: 0px 0px 0px 0px;">
                                           <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                             <td valign="top" align="center" style="padding: 0px 0px 0px 0px;">
                                              <div class="pc-font-alt  pc-w620-fontSize-32px" style="line-height: 120%;letter-spacing: -1px;font-family: Inter, Arial, Helvetica, sans-serif;font-size: 48px;font-weight: bold;font-variant-ligatures: normal;color: #27325e;text-align: center;text-align-last: center;">
                                               <div><span>Welcome  </span><span style="font-weight: 400;font-style: normal;color: rgb(236, 236, 236);">🎉</span>
                                               </div>
                                              </div>
                                             </td>
                                            </tr>
                                           </table>
                                          </td>
                                         </tr>
                                        </table>
                                       </td>
                                      </tr>
                                     </table>
                                    </td>
                                   </tr>
                                  </table>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top" style="padding: 0px 0px 36px 0px;">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                                <tr>
                                 <td valign="top" class="pc-font-alt pc-w620-fontSize-14px" align="center" style="padding: 0px 0px 0px 0px;mso-line-height: exactly;line-height: 150%;letter-spacing: 0.1px;font-family: Inter, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: normal;color: #27325e;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                                  <div><span>Great to see you ${name}! To be able to use our app please first confirm your email. </span>
                                  </div>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <th valign="top" class="pc-w620-spacing-0-0-32-0" align="center" style="padding: 0px 0px 32px 0px; font-weight: normal; line-height: 1;">
                               <!--[if mso]>
        <table  border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" width="320" style="border-collapse: separate; margin-right: auto; margin-left: auto;">
            <tr>
                <td valign="middle" align="center" style="width: 320px; border-radius: 100px 100px 100px 100px; background-color: #16a3b2; text-align: center; color: #ffffff; padding: 16px 45px 16px 45px;" bgcolor="#16a3b2">
                                    <a class="pc-font-alt" style="display: inline-block; text-decoration: none; font-variant-ligatures: normal; font-family: Inter, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 18px; line-height: 150%; letter-spacing: -0.2px; color: #ffffff;" href="${confirmUrl}" target="_blank">Confirm account</a>
                                </td> 
            </tr>
        </table>
        <![endif]-->
                               <!--[if !mso]><! --><a class="pc-w620-fontSize-16px" style="display: inline-block; border-radius: 100px 100px 100px 100px; background-color: #16a3b2; padding: 16px 45px 16px 45px; width: 320px; font-family: Inter, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 18px; line-height: 150%; letter-spacing: -0.2px; color: #ffffff; vertical-align: top; text-align: center; text-align-last: center; text-decoration: none; -webkit-text-size-adjust: none;" href="${confirmUrl}" target="_blank">Confirm account</a>
                               <!--<![endif]-->
                              </th>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <!--[if gte mso 9]>
                                                </td>
                                                <td width="24" style="line-height: 1px; font-size: 1px;" valign="top">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" height="24" style="line-height: 1px; font-size: 1px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p>
                    </v:textbox>
                </v:rect>
                <![endif]-->
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Gift Card -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Footer 7 -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 20px 40px 20px;border-radius: 0px 0px 20px 20px;background-color: #111747;" bgcolor="#111747">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" valign="top" style="padding: 0px 0px 14px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                    <tr>
                     <td valign="top" class="pc-font-alt" align="center" style="mso-line-height: exactly;line-height: 143%;letter-spacing: -0.2px;font-family: Inter, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: normal;color: #ffffff;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                      <div><span>Join our groming communities!</span>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" style="padding: 0px 0px 32px 0px;">
                   <table class="pc-width-hug pc-w620-gridCollapsed-0" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-w620-padding-0-20" valign="middle" style="padding-top: 0px; padding-right: 15px; padding-bottom: 0px; padding-left: 0px;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                <tr>
                                 <td valign="top" align="left">
                                  <a class="pc-font-alt" href="https://designmodo.com/postcards/" target="_blank" style="text-decoration: none;font-variant-ligatures: normal;text-align: left;text-align-last: left;">
                                   <img src="https://cloudfilesdm.com/postcards/6f73fa590c534ee37f2f2389685b97fe.png" class="" width="24" height="24" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:24px;height: auto;max-width: 100%;" alt="" />
                                  </a>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-w620-padding-0-20" valign="middle" style="padding-top: 0px; padding-right: 15px; padding-bottom: 0px; padding-left: 15px;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                <tr>
                                 <td valign="top" align="left">
                                  <a class="pc-font-alt" href="https://designmodo.com/postcards/" target="_blank" style="text-decoration: none;font-variant-ligatures: normal;text-align: left;text-align-last: left;">
                                   <img src="https://cloudfilesdm.com/postcards/4a86a4268ee8ab0dc83c61cd174169d7.png" class="" width="24" height="24" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:24px;height: auto;max-width: 100%;" alt="" />
                                  </a>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-w620-padding-0-20" valign="middle" style="padding-top: 0px; padding-right: 15px; padding-bottom: 0px; padding-left: 15px;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                <tr>
                                 <td valign="top" align="left">
                                  <a class="pc-font-alt" href="https://designmodo.com/postcards/" target="_blank" style="text-decoration: none;font-variant-ligatures: normal;text-align: left;text-align-last: left;">
                                   <img src="https://cloudfilesdm.com/postcards/09d3f01b09294af424e72dc005480fc8.png" class="" width="24" height="24" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:24px;height: auto;max-width: 100%;" alt="" />
                                  </a>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-grid-td-last pc-w620-padding-0-20" valign="middle" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 15px;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                <tr>
                                 <td valign="top" align="left">
                                  <a class="pc-font-alt" href="https://designmodo.com/postcards/" target="_blank" style="text-decoration: none;font-variant-ligatures: normal;text-align: left;text-align-last: left;">
                                   <img src="https://cloudfilesdm.com/postcards/cf55d05b96b7b00e4d88913995584ff1.png" class="" width="24" height="24" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:24px;height: auto;max-width: 100%;" alt="" />
                                  </a>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" valign="top" style="padding: 0px 0px 14px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                    <tr>
                     <td valign="top" class="pc-font-alt pc-w620-lineHeight-140pc" align="center" style="mso-line-height: exactly;line-height: 143%;letter-spacing: -0.2px;font-family: Inter, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: normal;color: #ffffff;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                      <div><span style="font-weight: 400;font-style: normal;color: rgb(255, 255, 255);">Copyright © 2024 Lumpik. All rights reserved.</span>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Footer 7 -->
         </td>
        </tr>
       </table>
      </td>
     </tr>
    </table>
   </td>
  </tr>
 </table>
 <!-- Fix for Gmail on iOS -->
 <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
 </div>
</body>

</html>
`;
