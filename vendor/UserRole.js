(function(exports){

    exports.isFreelancer = function(user){
        return user.user.userRole == 'user' &&
            (
                user.user.accountType == 'free' ||
                user.user.accountType == 'student' ||
                user.user.accountType == 'premium'
            );
    };

    exports.isCompany = function(user){
        return user.user.userRole  == 'user' &&
            (
                user.user.accountType  == 'company'
            );
    };

    exports.isSalesManager = function(user){
        return user.user.userRole == 'employee' &&
            (
                user.user.accountType == 'sales-manager'
            );
    };

    exports.isCompanyManager = function(user){
        return user.user.userRole  == 'employee' &&
            (
                user.user.accountType   == 'company-manager'
            );
    };

    exports.isProjectManager = function(user){
        return user.user.userRole == 'employee' &&
            (
                user.user.accountType == 'project-manager'
            );
    };

    exports.isUserManager = function(user){
        return user.user.userRole == 'employee' &&
            (
                user.user.accountType == 'user-manager'
            );
    };

    exports.canInitialChat = function(initiatorUser, interlocutorUser){
        if((exports.isFreelancer(initiatorUser) || exports.isCompany(initiatorUser)) && exports.isSalesManager(interlocutorUser)){
            return false;
        }

        if(exports.isUserManager(initiatorUser) && exports.isFreelancer(interlocutorUser)) {
            return false;
        }

        if(exports.isCompanyManager(initiatorUser) && exports.isCompany(interlocutorUser)) {
            return false;
        }

        if(exports.isProjectManager(initiatorUser) && (exports.isCompany(interlocutorUser) || exports.isFreelancer(interlocutorUser))){
            return false;
        }
        return true;
    };

    exports.canViewContact = function(user, contactUser){
        if((exports.isFreelancer(user) || exports.isCompany(user)) && exports.isSalesManager(contactUser)){
            return false;
        }

        return true;
    };



})(exports ? exports : this['UserRole'] = {});
