import { StyleSheet, Text, Dimensions, View, TouchableOpacity, WebView, Image } from 'react-native';
import React from 'react';

import colors from '../../../utils/colors'
import { MagicNumbers } from '../../../utils/DeviceConfig'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const WhyFacebook = ({kill, source}) => (
  <View style={styles.container}>
    <View style={{backgroundColor: colors.offwhite, height: 50, width: DeviceWidth}}>
      <TouchableOpacity style={{padding: 10, alignSelf: 'flex-end', borderRadius: 50, marginTop: 15}} onPress={() => { kill() }}>
        <Image source={require('./assets/close.png')} style={{width: 15, height: 15, tintColor: colors.outerSpace}} />
      </TouchableOpacity>
    </View>
    <WebView
      automaticallyAdjustContentInsets
      style={styles.webview}
      source={{html, baseUrl: '/'}}
      decelerationRate="normal"
      scalesPageToFit
      bounces
      dataDetectorTypes={'none'}
      scrollEnabled
    />

  </View>
)
const styles = StyleSheet.create({
  container: {
    width: DeviceWidth,
    height: DeviceHeight,

  },
  webview: {
    backgroundColor: colors.white,
    flexGrow: 1
  }
});
const html = `<!DOCTYPE html>
  <html>
    <head>
      <style>
        html,body{
          max-width:100%;
          background:#fff;
          padding: 0 5px;
          overflow-x:hidden;
          font-family:sans-serif;
        }
      </style>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    </head>
<body class="c7">
  <p class="c0"><span>Terms and Conditions</span></p>
  <p class="c0"><span class="c1">Last updated: November 10, 2016</span></p>
  <p class="c0"><span>By creating a Trippple account, whether through a mobile device or mobile application (collectively, the &ldquo;Service&rdquo;) you agree to be bound by the Trippple Terms of Use and </span><span class="c4">Privacy Policy</span><span class="c1">. If you do not accept and agree to be bound by all of the terms of this Agreement, please do not use the Service.</span></p>
  <p class="c0"><span class="c1">Acceptance</span></p>
  <p class="c0"><span class="c1">This Agreement is an electronic legally binding contract that establishes the terms you must accept to use the Service.</span></p>
  <p class="c0"><span class="c1">We may, at any time and for any reason make changes to this Agreement. This may be done for a multitude of reasons including to reflect changes to applicable laws, new features, or changes in business practices. The most recent version of this Agreement will be posted on the Services under Settings and also on trippple.co. If the changes include material changes that affect your rights or obligations, we will notify you of the changes by reasonable means, which could include notification through the Services. If you continue to use the Services after the changes become effective, then you shall be deemed to have accepted those changes. If you don&rsquo;t agree to these changes, you must end your relationship with us by ceasing to use the Services and disabling your Trippple account. </span></p>
  <p class="c0"><span class="c1">Eligibility. </span></p>
  <p class="c0"><span class="c1">You must be at least 18 years of age to create an account on Trippple and use the Service. By creating a Trippple account and using the Service, you assert and warrant that you can (a) enter into a binding contract with Trippple, (b) you are not a person who is prohibited from using the Service under the laws of the United States or any other applicable jurisdiction and (c) you will comply with this Agreement and all applicable local, state, national and international laws, rules and regulations. If you create an account, you assert and warrant that you have never been convicted of a felony and that you are not required to register as a sex offender with any state, federal or local sex offender registry.</span></p>
  <p class="c0"><span class="c1">Creating an Account. </span></p>
  <p class="c0"><span class="c1">In order to use Trippple, you must have or create a Facebook account and sign in using your Facebook credentials. &nbsp;By doing so, you authorize us to access and use certain Facebook account information, including but not limited to your public Facebook profile and information about Facebook friends you might share in common with other Trippple users. For more information regarding the information we collect and how we use it, please consult our Privacy Policy.</span></p>
  <p class="c0 c5"><span class="c1"></span></p>
  <p class="c0 c5"><span class="c1"></span></p>
  <p class="c0"><span class="c1">Term and Termination. </span></p>
  <p class="c0"><span class="c1">This Agreement will remain in effect while you use the Service and/or have a Trippple account. You may terminate your account at any time, for any reason, by following the instructions in &ldquo;Settings&rdquo; in the Service. The Company may terminate or suspend your account at any time without notice if the Company believes that you have breached this Agreement. After your account is terminated, this Agreement will terminate.</span></p>
  <p class="c0"><span class="c1">Non-commercial Use. </span></p>
  <p class="c0"><span class="c1">The Service is for personal use only. Users may not use the Service or any content contained in the Service (including, but not limited to, content of other users, designs, text, graphics, images, video, logos, software, and computer code) in connection with any commercial endeavors, such as advertising or soliciting any user to buy or sell any products or services not offered by the Company. Users of the Service may not use any information obtained from the Service to contact, advertise to, solicit, or sell to any other user without his or her prior explicit consent. Organizations, companies, and/or businesses may not use the Service for any purpose except with the Company&rsquo;s express consent (such as for promoted profiles or other advertisements), which the Company may provide or deny at its sole discretion. The Company may investigate and take any available legal action in response to illegal and/or unauthorized uses of the Service.</span></p>
  <p class="c0"><span class="c1">Account Security. </span></p>
  <p class="c0"><span class="c1">It is your responsibility to maintain the confidentiality and security of your Facebook login credentials you use to sign up and log in to Trippple. You are solely responsible for all activities that occur on Trippple under those credentials. You agree to immediately notify the Company of any disclosure or unauthorized use of your login credentials at help@trippple.co.</span></p>
  <p class="c0"><span class="c1">Interacting with other Users.</span></p>
  <p class="c0"><span class="c1">YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH OTHER USERS. YOU UNDERSTAND THAT THE COMPANY DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS ON ITS USERS. THE COMPANY ALSO DOES NOT VERIFY THE STATEMENTS OF ITS USERS. THE COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES AS TO THE CONDUCT OF USERS OR THEIR COMPATIBILITY WITH ANY CURRENT OR FUTURE USERS. </span></p>
  <p class="c0"><span class="c1">The Company is not responsible for the conduct of any user. In no event shall the Company, its affiliates or its partners be liable (directly or indirectly) for any losses or damages whatsoever, whether direct, indirect, general, special, compensatory, consequential, and/or incidental, arising out of or relating to the conduct of you or anyone else in connection with the use of the Service including, without limitation, death, bodily injury, emotional distress, and/or any other damages resulting from communications or meetings with other users or persons you meet through the Service. You agree to take all necessary precautions in all interactions with other users, particularly if you decide to communicate off the Service or meet in person, or if you decide to send money to another user. You should not provide your financial information (for example, your credit card or bank account information), or wire or otherwise send money, to other users.</span></p>
  <p class="c0"><span class="c1">Content Posted by You.</span></p>
  <p class="c0"><span class="c1">You are solely responsible for the content and information that you post, upload, publish, link to, transmit, record, display or otherwise make available (collectively, &ldquo;post&rdquo;) on the Service or transmit to other users, including chat, videos, photographs, or profile text, whether publicly posted or privately transmitted (collectively, &ldquo;Content&rdquo;). You may not post as part of the Service, or transmit to the Company or any other user (either on or off the Service), any nude, offensive, inaccurate, incomplete, abusive, obscene, profane, threatening, intimidating, harassing, racially offensive, or illegal material, or any material that infringes or violates another person&rsquo;s rights (including intellectual property rights, and rights of privacy and publicity). You represent and warrant that (a) all information that you submit upon creation of your account, including information submitted from your Facebook account, is accurate and truthful and that you will promptly update any information provided by you that subsequently becomes inaccurate, incomplete, misleading or false and (b) you have the right to post the Content on the Service and grant the licenses set forth below.</span></p>
  <p class="c0"><span class="c1">You understand and agree that the Company may, but is not obligated to, monitor or review any Content you post as part of a Service. The Company may delete any Content, in whole or in part, that in the sole judgment of the Company violates this Agreement or may harm the reputation of the Service or the Company.</span></p>
  <p class="c0"><span class="c1">By posting Content as part of the Service, you grant to Trippple a worldwide, transferable, sub-licensable, royalty-free, right and license to host, store, use, copy, display, reproduce, adapt, edit, publish, modify and distribute the Content. This license is for the limited purpose of operating, developing, providing, promoting, and improving the Service and researching and developing new ones.</span></p>
  <p class="c0"><span class="c1">You may not post, upload, share, display or otherwise make Content available that:</span></p>
  <ul class="c2 lst-kix_list_11-0 start">
    <li class="c3"><span class="c1">promotes racism, bigotry, hatred or physical harm of any kind against any group or individual;</span></li>
    <li class="c3"><span class="c1">advocates harassment or intimidation of another person;</span></li>
    <li class="c3"><span class="c1">requests money from, or is intended to defraud, other users of the Service;</span></li>
    <li class="c3"><span class="c1">spams or solicits users;</span></li>
    <li class="c3"><span class="c1">promotes information that is false or misleading, or promotes illegal activities or conduct that is defamatory, libelous or otherwise objectionable;</span></li>
    <li class="c3"><span class="c1">promotes an illegal or unauthorized copy of another person&rsquo;s copyrighted work, such as providing pirated computer programs, images, audio or video files or links to them;</span></li>
    <li class="c3"><span class="c1">contains video, audio photographs, or images of another person without his or her permission (or in the case of a minor, the minor&rsquo;s legal guardian);</span></li>
    <li class="c3"><span class="c1">contains restricted or password only access pages, or hidden pages or images (those not linked to or from another accessible page);</span></li>
    <li class="c3"><span class="c1">provides material that exploits people in a sexual, violent or other illegal manner, or solicits personal information from anyone under the age of 18;</span></li>
    <li class="c3"><span class="c1">provides instructional information about illegal activities such as making or buying illegal weapons or drugs, violating someone&rsquo;s privacy, or providing, disseminating or creating computer viruses;</span></li>
    <li class="c3"><span class="c1">contains viruses, time bombs, trojan horses, cancelbots, worms or other harmful, or disruptive codes, components or devices;</span></li>
    <li class="c3"><span class="c1">impersonates, or otherwise misrepresents affiliation, connection or association with, any person or entity;</span></li>
    <li class="c3"><span class="c1">provides information or data you do not have a right to make available under law or under contractual or fiduciary relationships (such as inside information, proprietary and confidential information); and</span></li>
    <li class="c0 c6"><span class="c1">solicits passwords or personal identifying information for commercial or unlawful purposes from other users or disseminates another person&rsquo;s personal information without his or her permission.</span></li>
  </ul>
  <p class="c0"><span class="c1">The Company reserves the right, in its sole discretion, to investigate and take any legal action against anyone who violates this provision, including removing the offending communication from the Service and terminating or suspending the account of such violators.</span></p>
  <p class="c0"><span class="c1">Your use of the Service, including all Content you post through the Service, must comply with all applicable laws and regulations. You agree that the Company may access, preserve and disclose your account information and Content if required to do so by law or in a good faith belief that such access, preservation or disclosure is reasonably necessary, such as to: (a) comply with legal process; (b) enforce this Agreement; (c) respond to claims that any Content violates the rights of third parties; (d) respond to your requests for customer service or allow you to use the Service in the future; or (e) protect the rights, property or personal safety of the Company or any other person.</span></p>
  <p class="c0"><span class="c1">You agree that any Content you post on the Service may be viewed by other users and may be viewed by any person visiting or participating in the Service (such as individuals who may receive shared Content from other Trippple users).</span></p>
  <p class="c0"><span class="c1">Prohibited Activities. </span></p>
  <p class="c0"><span class="c1">The Company reserves the right to investigate, suspend and/or terminate your account if you have misused the Service or behaved in a way the Company regards as inappropriate or unlawful, including actions or communications the occur off the Service but involve users you meet through the Service. The following is a partial list of the type of actions that you may not engage in with respect to the Service. You will not:</span></p>
  <ul class="c2 lst-kix_list_12-0 start">
    <li class="c3"><span class="c1">impersonate any person.</span></li>
    <li class="c3"><span class="c1">solicit money from any users.</span></li>
    <li class="c3"><span class="c1">&nbsp;&ldquo;stalk&rdquo; or otherwise harass any user.</span></li>
    <li class="c3"><span class="c1">express or imply that any statements you make are endorsed by the Company without our specific prior written consent.</span></li>
    <li class="c3"><span class="c1">use the Service in an illegal manner or to commit an illegal act.</span></li>
    <li class="c3"><span class="c1">access the Service in a jurisdiction in which it is illegal or unauthorized.</span></li>
    <li class="c3"><span class="c1">use any robot, spider, site search/retrieval application, or other manual or automatic device or process to retrieve, index, &ldquo;data mine&rdquo;, or in any way reproduce or circumvent the navigational structure or presentation of the Service or its contents.</span></li>
    <li class="c3"><span class="c1">interfere with or disrupt the Service or the servers or networks connected to the Service.</span></li>
    <li class="c3"><span class="c1">forge headers or otherwise manipulate identifiers in order to disguise the origin of any information transmitted to or through the Service (either directly or indirectly through use of third party software).</span></li>
    <li class="c3"><span class="c1">&ldquo;frame&rdquo; or &ldquo;mirror&rdquo; any part of the Service, without the Company&rsquo;s prior written authorization.</span></li>
    <li class="c3"><span class="c1">use meta tags or code or other devices containing any reference to the Company or the Service (or any trademark, trade name, service mark, logo or slogan of the Company) to direct any person to any other website for any purpose.</span></li>
    <li class="c3"><span class="c1">modify, adapt, sublicense, translate, sell, reverse engineer, decipher, decompile or otherwise disassemble any portion of the Service any software used on or for the Service, or cause others to do so.</span></li>
    <li class="c0 c6"><span class="c1">post, use, transmit or distribute, directly or indirectly, (e.g. screen scrape) in any manner or media any content or information obtained from the Service other than solely in connection with your use of the Service in accordance with this Agreement.</span></li>
  </ul>
  <p class="c0"><span class="c1">Modifications to Service. </span></p>
  <p class="c0"><span class="c1">The Company reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that the Company shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service. To protect the integrity of the Service, the Company reserves the right at any time in its sole discretion to block users from certain IP addresses from accessing the Service.</span></p>
  <p class="c0"><span class="c1">Copyright Policy. </span></p>
  <p class="c0"><span class="c1">We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Service infringes on the copyright or other intellectual property rights (&quot;Infringement&quot;) of any person or entity.</span></p>
  <p class="c0"><span class="c1">If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to legal@trippple.co, with the subject line: &quot;Copyright Infringement&quot; and include in your claim a detailed description of the alleged Infringement as detailed below:</span></p>
  <p class="c0"><span class="c1">an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright&#39;s interest;</span></p>
  <p class="c0"><span class="c1">a description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work;</span></p>
  <p class="c0"><span class="c1">identification of the URL or other specific location on the Service where the material that you claim is infringing is located;</span></p>
  <p class="c0"><span class="c1">your address, telephone number, and email address;</span></p>
  <p class="c0"><span class="c1">a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</span></p>
  <p class="c0"><span class="c1">a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner&#39;s behalf.</span></p>
  <p class="c0"><span class="c1">The Company will terminate the accounts of repeat copyright infringers.</span></p>
  <p class="c0"><span class="c1">Disclaimers.</span></p>
  <p class="c0"><span class="c1">You acknowledge and agree that neither the Company nor its affiliates and third party partners are responsible for and shall not have any liability, directly or indirectly, for any loss or damage, including personal injury or death, as a result of or alleged to be the result of (a) any incorrect or inaccurate Content posted in the Service, whether caused by users or any of the equipment or programming associated with or utilized in the Service; (b) the timeliness, deletion or removal, incorrect delivery or failure to store any Content or communications; (c) the conduct, whether online or offline, of any user; (d) any error, omission or defect in, interruption, deletion, alteration, delay in operation or transmission, theft or destruction of, or unauthorized access to, any user or user communications; or (e) any problems, failure or technical malfunction of any telephone network or lines, computer online systems, servers or providers, computer equipment, software, failure of email or players on account of technical problems or traffic congestion on the Internet or at any website or combination thereof, including injury or damage to users or to any other person&rsquo;s computer or device related to or resulting from participating or downloading materials in connection with the Internet and/or in connection with the Service. TO THE MAXIMUM EXTENT ALLOWED BY APPLICABLE LAW, THE COMPANY PROVIDES THE SERVICE ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS AND GRANTS NO WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE WITH RESPECT TO THE SERVICE (INCLUDING ALL CONTENT CONTAINED THEREIN), INCLUDING (WITHOUT LIMITATION) ANY IMPLIED WARRANTIES OF SATISFACTORY QUALITY, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT. THE COMPANY DOES NOT REPRESENT OR WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR FREE, SECURE OR THAT ANY DEFECTS OR ERRORS IN THE SERVICE WILL BE CORRECTED.</span></p>
  <p class="c0"><span class="c1">ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SERVICE IS ACCESSED AT YOUR OWN DISCRETION AND RISK, AND YOU WILL BE SOLELY RESPONSIBLE FOR AND HEREBY WAIVE ANY AND ALL CLAIMS AND CAUSES OF ACTION WITH RESPECT TO ANY DAMAGE TO YOUR DEVICE, COMPUTER SYSTEM, INTERNET ACCESS, DOWNLOAD OR DISPLAY DEVICE, OR LOSS OR CORRUPTION OF DATA THAT RESULTS OR MAY RESULT FROM THE DOWNLOAD OF ANY SUCH MATERIAL. IF YOU DO NOT ACCEPT THIS LIMITATION OF LIABILITY, YOU ARE NOT AUTHORIZED TO DOWNLOAD OR OBTAIN ANY MATERIAL THROUGH THE SERVICE.</span></p>
  <p class="c0"><span class="c1">Limitation on Liability. </span></p>
  <p class="c0"><span class="c1">TO THE FULLEST EXTENT ALLOWED BY APPLICABLE LAW, IN NO EVENT WILL THE COMPANY, ITS AFFILIATES, BUSINESS PARTNERS, LICENSORS OR SERVICE PROVIDERS BE LIABLE TO YOU OR ANY THIRD PERSON FOR ANY INDIRECT, RELIANCE, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF PROFITS, LOSS OF GOODWILL, DAMAGES FOR LOSS, CORRUPTION OR BREACHES OF DATA OR PROGRAMS, SERVICE INTERRUPTIONS AND PROCUREMENT OF SUBSTITUTE SERVICES, EVEN IF THE COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, THE COMPANY&#39;S LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER, AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO THE COMPANY FOR THE SERVICE WHILE YOU HAVE AN ACCOUNT.</span></p>
  <p class="c0"><span class="c1">SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OR ALL OF THE EXCLUSIONS AND LIMITATIONS IN THIS SECTION MAY NOT APPLY TO YOU.</span></p>
  <p class="c0"><span class="c1">Arbitration and Governing Law.</span></p>
  <p class="c0"><span class="c1">Except for users residing within the European Union, Norway and elsewhere where prohibited by applicable law:</span></p>
  <p class="c0"><span class="c1">The exclusive means of resolving any dispute or claim arising out of or relating to this Agreement (including any alleged breach thereof) or the Service shall be BINDING ARBITRATION administered by the American Arbitration Association. </span></p>
  <p class="c0"><span class="c1">By using the Service in any manner, you agree to the above arbitration agreement. In doing so, YOU GIVE UP YOUR RIGHT TO GO TO COURT to assert or defend any claims between you and the Company. YOU ALSO GIVE UP YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION OR OTHER CLASS PROCEEDING. Your rights will be determined by a NEUTRAL ARBITRATOR, NOT A JUDGE OR JURY. You are entitled to a fair hearing before the arbitrator. Decisions by the arbitrator are enforceable in court and may be overturned by a court only for very limited reasons.</span></p>
  <p class="c0"><span class="c1">Any proceeding to enforce this arbitration agreement, including any proceeding to confirm, modify, or vacate an arbitration award, may be commenced in any court of competent jurisdiction. In the event that this arbitration agreement is for any reason held to be unenforceable, any litigation against the Company may be commenced only in the federal or state courts located in Miami-Dade County, Florida, USA. You hereby irrevocably consent to the jurisdiction of those courts for such purposes.</span></p>
  <p class="c0"><span class="c1">This Agreement, and any dispute between you and the Company, shall be governed by the laws of the state of Florida without regard to principles of conflicts of law, provided that this arbitration agreement shall be governed by the Federal Arbitration Act.</span></p>
  <p class="c0"><span class="c1">For users residing in the European Union, Norway or elsewhere where this arbitration agreement is prohibited by law, the laws of Florida, (U.S.A.). All claims arising out of or relating to this Agreement or the Services will be litigated exclusively in the federal or state courts of Miami-Dade County, Florida, USA, and you and the Company consent to personal jurisdiction in those courts.</span></p>
  <p class="c0"><span class="c1">Indemnity by You. </span></p>
  <p class="c0"><span class="c1">You agree to indemnify and hold the Company, its subsidiaries, and affiliates, and its and their officers, agents, partners and employees, harmless from any loss, liability, claim, or demand, including reasonable attorney&rsquo;s fees, made by any third party due to or arising out of your breach of or failure to comply with this Agreement (including any breach of your representations and warranties contained herein), any postings or Content you post in the Service, and the violation of any law or regulation by you. The Company reserves the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with the Company in connection therewith.</span></p>
  <p class="c0"><span class="c1">Notice. </span></p>
  <p class="c0"><span class="c1">The Company may provide you with notices, including those regarding changes to this Agreement, using any reasonable means, which may include email, SMS, MMS, text message or postings in the Service. Such notices may not be received if you violate this Agreement by accessing the Service in an unauthorized manner. You agree that you are deemed to have received any and all notices that would have been delivered had you accessed the Service in an authorized manner.</span></p>
  <p class="c0 c5"><span class="c1"></span></p>
  <p class="c0"><span class="c1">Entire Agreement; Other. </span></p>
  <p class="c0" id="h.gjdgxs"><span class="c1">This Agreement, with the Privacy Policy and any specific guidelines or rules that are separately posted for particular services or offers in the Service, contains the entire agreement between you and the Company regarding the use of the Service. If any provision of this Agreement is held invalid, the remainder of this Agreement shall continue in full force and effect. The failure of the Company to exercise or enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision. You agree that your Trippple account is non-transferable and all of your rights to your profile or contents within your Trippple account terminate upon your death. No agency, partnership, joint venture or employment is created as a result of this Agreement and you may not make any representations or bind the Company in any manner.</span></p>
</body>

</html>
`;


export default WhyFacebook
