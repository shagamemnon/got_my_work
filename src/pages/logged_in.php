
<?php session_start(); /* Starts the session */

if(!isset($_SESSION['UserData']['Username'])){
  header("location:thanks.php");
  exit;
}
?>

Congratulation! You have logged into password protected page. <a href="logout.php">Click here</a> to Logout.
Ready, now our login system perfectly done but we also need to provide a logout facility to user, so we require to create a logout page.



<html>
  <head>
    <link rel="stylesheet" href="vendor/foundation.min.css">
    <link rel="stylesheet" href="dist/css/main.css">
  </head>
  <body>
<div class='terms-of-service-container'>
  <h1 class='tos-title headline'>Terms of Conditions of Use</h1>
  <p class='tos-text'>
    Please read these terms and conditions of use (the ”terms”) carefully. They may be amended from time to time by Us without notice, and they form a binding agreement between you and Centscere LLC (“We”, “Our” or “Us”) governing the manner in which you are permitted to use Our website and the services offered thereby (the “Site”) and the services it offers. The privacy policy is hereby incorporated by reference into these terms. These terms will be updated from time to time and will always be available here. Failure to agree to the terms will result in your being unable to use the Site or services. Any breach of these terms will result in your being unable to use the Site or services and may subject you to additional civil penalties.
  </p>

  <h2 class='tos-title'>Registration: Use</h2>
  <p class='tos-text'>
    You may utilize the Site to identify charitable organizations to which you wish to advise your charitable donations, to make such advisements via designation of the charitable organizations, and to track such charitable donations (the “Services”). In order to utilize the Site and obtain Services, You must to register with Us using complete and accurate information for all fields requested, which You are responsible for maintaining as current. You will only be permitted to register on Your own behalf and no other person or entity, unless You are an authorized representative of that entity. We may refuse Your registration or cancel Your account at any time, for any or no reason, in Our sole discretion, resulting in Your inability to utilize the Site or the Services. The Site works hard to ensure accuracy at all times, assumes no liability for any database malfunctions. Notwithstanding this provision, if you believe your interactions have been counted incorrectly, you may submit a help request to info@centscere.com. Cancellation of Your registration may result in the forfeiture and destruction of all information associated with Your account. If You wish to terminate Your account, You may do so by notifying Us and ceasing all use of the Service. These Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
  </p>
  <p class='tos-text'>
    You are solely responsible and liable for activity that occurs on Your account, shall not permit any third person or party to access or use Your account and shall be responsible for maintaining the confidentiality of Your password. You are not permitted to use another user's account. You will immediately notify Us in writing of any unauthorized use of Your account, or other account related security breach of which You are aware. You represent and warrant that if You are an individual, You are of legal age to form a binding contract, or that if You are registering on behalf of an entity, that You are authorized to enter into, and bind the entity to, these Terms. You are solely responsible for ensuring that these Terms are in compliance with all laws, rules and regulations applicable to You. As a condition of use, You promise not to use the Site or Service for any purpose that is not expressly permitted by these Terms. You shall not take any action that attempts to (i) interfere or has the effect of interfering with the proper working of the Site or Services, (ii) bypass any security measures of the Site or Services, (iii) collect, use or scrape any content from the Site, or (iv) modify, appropriate, reproduce, distribute, reverse engineer, mine, create derivative works or adaptations of, publicly display, sell, trade, or in any way exploit the Service or Site content, except as expressly authorized by the Terms. You are granted no license in any text, graphics, logos, systems, operations, processes, designs or any other intellectual property, whether or not patentable, copyrightable, or otherwise, except as expressly set forth herein.
  </p>

  <h2 class='tos-title'>PROCESSING OF CONTRIBUTIONS</h2>
  <p class='tos-text'>
    Central New York Community Foundation (the “Foundation”) is a 501(c)(3) nonprofit which operates a donor advised fund to handle charitable contributions.
  </p>
  <p class='tos-text'>
    The Site contains pages displaying charities and other qualifying tax-exempt organizations registered either in the IRS Master File or through rigorous assessment of their legal status by Us (“Registered Organization(s)”).  Each and every tax-exempt organization appearing on the Site is approved to receive regrants of donor-advised gifts contributed to The Foundation’s donor advised fund. The existence of Registered Organization pages on the Site does not constitute as solicitation of donations; We do not engage in any solicitation activities on behalf of any Registered Organization.
  </p>
  <p class='tos-text'>
    Donations to a Registered Organization or charitable cause made through the Site go to and will be receipted by The Foundation as a donor-advised gift. The Foundation makes every effort to fulfill donor advisements and is authorized to do so for advisements to Registered Charities displayed on the Site.
  </p>
  <p class='tos-text'>
    It is The Foundation’s standard practice to regrant 88.6% of a donor-advised contribution to a qualifying tax-exempt entity, and to retain 11.4% for The Foundation’s expenses (including credit card transaction costs incurred by Our payment processor, Stripe Payments). The Foundation makes every reasonable effort to respect the advisements of its donors. However, to comply with federal tax laws and Internal Revenue Service regulations, The Foundation must retain the exclusive authority, discretion, and legal control over all gifts it receives. The Foundation reserves the exclusive right to select an alternate charity to receive your advised funds.
  </p>
  <p class='tos-text'>
    We strongly encourage all Registered Organizations listed on the Site to employ gifts received through the Site or The Foundation for the purpose stated on the Site. However, it is the policy of The Foundation to designate all regrants for unrestricted use.
  </p>
  <p class='tos-text'>
    Users holding Administrative Access function as the page administrator of the Registered Charity, and thereby permit you to create campaigns in connection with your organization, update content on the Registered Charity page, and access charitable contributions and regrant information for the charity. Additionally, should a Donor provide Us with information related to a matching gift, your information will be shared with third parties for the purpose of processing the matching gift donation.
  </p>
  <p class='tos-text'>
    If you hold administrative access, you agree that neither Centscere LLC nor The Foundation, nor any of their affiliates, approve of such campaigns, and they have no involvement in, or control over the planning, organization, or conducting of such campaigns.  
  </p>

  <h2 class='tos-title'>SPECIAL DONOR PROVISIONS</h2>
  <p class='tos-text'>
    The following paragraph applies only to users using the Site to make contributions. You shall be an advisor to The Foundation’s Donor Advised Fund and shall recommend regrants through your designations on the Site. It is the general policy of The Foundation to make distributions based upon Donor Advisements each month. The total of such distributions shall never exceed your contribution to The Foundation. You reserve the right to advise and make recommendations to The Foundation with respect to your contribution. Once your contribution has been made, that contribution shall be the property of The Foundation. The Foundation does not restrict the use of contributions by any Registered Organizations.
  </p>

  <h2 class='tos-title'>Representations</h2>
  <p class='tos-text'>
    Each time You choose to use the Services, You will be deemed to represent and warrant that You have a legal right to do so.
  </p>

  <h2 class='tos-title'>Disclaimer: Limitation of Liability</h2>
  <p class='tos-text'>
    Our site and the services are provided "as is," "as available" and are provided without any representations or warranties of any kind, express or implied, including, but not limited to, the implied warranties of title, non-infringement, merchantability and fitness for a particular purpose, and any warranties implied by any course of performance or usage of trade, all of which are expressly disclaimed, save to the extent required by law. We do not warrant that: a) the site or services will be available at any particular time or location; b) any defects or errors will be corrected; c) any content available at or through the site is free of viruses or other harmful components; or d) the results of using the services will meet your requirements as to quality or timeliness.
  </p>
  <p class='tos-text'>
    All liability of Us, Our managers, members, employees, agents, representatives, partners, suppliers, content providers, officers and successors howsoever arising for any loss suffered as a result of your use of the site or services is expressly excluded to the fullest extent permitted by law, save that, if a court of competent jurisdiction determines that liability of Us, Our directors, employees, officers, agents, representatives, partners, suppliers, content providers or successors (as applicable) (the “Centscere entities”) has arisen, the total of such liability shall be limited in aggregate to the total donations made by you. To the maximum extent permitted by applicable law, in no event shall the Centscere entities be liable under contract, tort, strict liability, negligence or any other legal or equitable theory or otherwise (and whether or not any of such persons or entities had prior knowledge of the circumstances giving rise to such loss or damage) with respect to the site or services for: indirect or consequential losses or damages; loss of actual or anticipated profits; loss of revenue; loss of goodwill; loss of data; wasted expenditure; or cost of procurement of substitute goods or services. In no event shall We be liable for any damages whatsoever, whether direct, indirect, general, special, compensatory, consequential, and/or incidental, arising out of or relating to the conduct of you in connection with the use of the services, including without limitation, bodily or personal injury, damage to property and/or any other damages resulting therefrom.
  </p>

  <h2 class='tos-title'>Indemnification</h2>
  <p class='tos-text'>
    You shall defend, indemnify, and hold harmless the Centscere Entities from all losses, costs, actions, claims, damages, expenses (including reasonable legal costs) or liabilities, that arise from or relate to Your use or misuse of, or access to, the Site or Services, violation of these Terms, breach of representations herein or third-party using Your account. We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by You, in which event You will assist and cooperate with Us in asserting any available defenses.
  </p>

  <h2 class='tos-title'>Payment</h2>
  <p class='tos-text'>
    When utilizing the Services, the applicable amount of contributions will be taken up front using Our third-party payment services.Payments shall all be subject to Your user agreement with Your credit card, and You hereby authorize Us to charge Your credit card for such amounts and to submit such charge to Our third-party payment processor. We will not be liable for any tax or withholding.
  </p>

  <h2 class='tos-title'>Governing Law</h2>
  <p class='tos-text'>
    These Terms shall be governed by and construed in accordance with the laws of the State of New York excluding its conflicts of law rules. For all purposes of these Terms, the parties consent to exclusive jurisdiction and venue in the United States Federal Courts or State Courts located in the County of Onondaga, State of New York. In the event the Services are considered a "commercial item" as that term is defined at 48 C.F.R. 2.101, then consistent with 48 C.F.R. 12.212 and 48 C.F.R. 227.7202-1 through 227.7202-4, all U.S. Government end users acquire the Services and any related documentation with only those rights set forth in these Terms. The Services are subject to certain export restrictions of the United States Government. If You are (a) in a country to which export from the United States is restricted for anti-terrorism reasons, or a national of any such country, wherever located, (b) in a country to which the United States has embargoed or restricted the export of goods or services, or a national of any such country, wherever located, or (c) a person or entity who has been prohibited from participating in United States export transactions by any agency of the United States Government, then You may not install, download, access, use, or license the Services or the SIte. You warrant and represent, and shall be deemed to continuously warrant and represent, that (1) You do not match the criteria set forth in (a), (b), or (c) above, (2) that You will not export or re-export the Services to any country, person, or entity subject to U.S. export restrictions, including those persons and entities that match the criteria set forth in (a), (b), or (c) above, and (3) that neither the United States Bureau of Industry and Security, nor any other U.S. federal agency, has suspended, revoked, or denied Your export privileges.
  </p>

  <h2 class='tos-title'>Links To Third-party Web Sites</h2>
  <p class='tos-text'>
    The Site may contain links to third-party Web sites, which are not under the control of Us. We make no representations whatsoever about any other Web site to which You may have access through the Site. When you access a third party Web site, you do so at your own risk and We are not responsible for the accuracy or reliability of any information, data, opinions, advice, or statements made on these sites. We provide these links merely as a convenience and the inclusion of such links does not imply that We endorse or accept any responsibility for the content or uses of such Web sites.
  </p>

  <h2 class='tos-title'>Miscellaneous</h2>
  <p class='tos-text'>
    These Terms and the User Agreement are the entire agreement between You and Us with respect to the Site and Services, and supersede all prior or contemporaneous communications and proposals (whether oral, written or electronic) between You and Us with respect thereto. If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect and enforceable. The failure of either party to exercise in any respect any right provided for herein shall not be deemed a waiver of any further rights hereunder. Waiver of compliance in any particular instance does not mean that We will waive compliance in the future. In order for any waiver of compliance with these Terms to be binding, We must provide You with written notice of such waiver. These Terms are personal to You, and are not assignable, transferable or sublicensable by You except with Our prior written consent. We may assign, transfer or delegate any of Our rights and obligations hereunder without consent. No agency, partnership, joint venture, or employment relationship is created as a result of these Terms and neither party has any authority of any kind to bind the other in any respect. Any right not expressly granted herein is reserved by Us. Unless otherwise specified in these Terms, all notices under these Terms will be in writing and will be deemed to have been duly given when received, if personally delivered or sent by certified or registered mail, return receipt requested; when receipt is electronically confirmed, if transmitted by facsimile or e-mail; or the day after it is sent, if sent for next day delivery by recognized overnight delivery service. If You believe that any content on the Site belonging to use has been has copied in any way that constitutes copyright infringement, or Your intellectual property rights have been otherwise violated, please notify Us of such claims.
  </p>
</div>


  <div class="footer-wrapper">
    <footer class="footer">
      <div class="row full-width">
        <div class="small-12 medium-12 large-3 columns">
          <h4 style="margin-bottom: 20px"><br>100%. Forever</h4><img src="https://s3.amazonaws.com/mycents/photos/website-header/100percenthomepage.png" style="max-height:120px">
        </div>
        <div class="small-12 medium-12 large-3 columns">
         <h4 style="margin-bottom: 20px"><br>We're a Proud B Corp</h4><img src="https://s3.amazonaws.com/mycents/photos/website-header/bcorpwhite.png" style="max-height:120px">

        </div>
        <div class="small-12 medium-12 large-3 columns" align="center">
          <h4><br>Connect With Us</h4>
          <ul class="footer-links">
            <li><a href="https://www.facebook.com/Centscere">Facebook</a></li>
            <li><a href="https://www.twitter.com/Centscere">Twitter</a></li>
            <li><a href="https://plus.google.com/101651359924605629089/about?hl=en">Google+</a></li>
          <ul>
        </div>
        <div class="small-12 medium-12 large-3 columns" align="center">
           <h4><br>Legal & Privacy</h4>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          <ul>
        </div>
      </div>
    </footer>
  </div>


</body>
</html>
