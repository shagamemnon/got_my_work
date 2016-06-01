<?php session_start(); /* Starts the session */
  
  /* Check Login form submitted */  
  if(isset($_POST['Submit'])){
    /* Define username and associated password array */
    $logins = array('Alex' => '123456','username1' => 'password1','username2' => 'password2');
    
    /* Check and assign submitted Username and Password to new variable */
    $Username = isset($_POST['Username']) ? $_POST['Username'] : '';
    $Password = isset($_POST['Password']) ? $_POST['Password'] : '';
    
    /* Check Username and Password existence in defined array */    
    if (isset($logins[$Username]) && $logins[$Username] == $Password){
      /* Success: Set session variables and redirect to Protected page  */
      $_SESSION['UserData']['Username']=$logins[$Username];
      header("location:logged_in.php");
      exit;
    } else {
      /*Unsuccessful attempt: Set error message */
      $msg="<span style='color:red'>Invalid Login Details</span>";
    }
  }
?>
<html>
  <head>
    <link rel="stylesheet" href="vendor/foundation.min.css">
    <link rel="stylesheet" href="dist/css/main.css">
    <link rel="stylesheet" href="dist/css/landing_page.css">
  </head>
  <body>
  <br><br>
<div style="background-color: white; height: 1000px;margin-top: -40px">
<br><br><br><img src="https://s3.amazonaws.com/igotmywork/logoblack.png" style="display: block;margin: auto;max-width: 100%"><br><br><br><br><br><br>
<h1 style="font-family: 'Gotham'; sans-serif; font-size: 2em; text-align: center; max-width: 600px;margin: auto;font-weight:300;line-height:1.5">Thank You for Signing Up. Our team will be in touch with you soon.</h1><br><br><br><br><br>
<div class="view-all" style="background-color: white;border-bottom: 60px solid white"><a href="/"><button style="width:380px">RETURN TO IGOTMYWORK</button></a></div>

<form action="" method="post" name="Login_Form">
  <table width="400" border="0" align="center" cellpadding="5" cellspacing="1" class="Table">
    <?php if(isset($msg)){?>
    <tr>
      <td colspan="2" align="center" valign="top"><?php echo $msg;?></td>
    </tr>
    <?php } ?>
    <tr>
      <td colspan="2" align="left" valign="top"><h3>Login</h3></td>
    </tr>
    <tr>
      <td align="right" valign="top">Username</td>
      <td><input name="Username" type="text" class="Input"></td>
    </tr>
    <tr>
      <td align="right">Password</td>
      <td><input name="Password" type="password" class="Input"></td>
    </tr>
    <tr>
      <td> </td>
      <td><input name="Submit" type="submit" value="Login" class="Button3"></td>
    </tr>
  </table>
</form>
