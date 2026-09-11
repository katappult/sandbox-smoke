package com.katappult.cloud.platform.generated.rest;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.katappult.core.model.account.UserAccount;
import com.katappult.core.model.composite.Container;
import com.katappult.core.model.people.person.Person;
import com.katappult.core.model.typed.Type;
import com.katappult.core.rest.BaseAuthenticationServiceFacade;
import com.katappult.core.rest.model.SuccessRestResponse;
import com.katappult.core.service.impl.MyUserDetailsService;
import com.katappult.core.service.security.AuthenticationUtils;
import com.katappult.core.service.security.RefreshTokenService;
import com.katappult.core.utils.JWTTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.Serializable;
import java.security.GeneralSecurityException;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

/**
 * Login social Google — flux Google Identity Services (ID token vérifié côté serveur).
 * Le frontend envoie l'ID token Google ; on le vérifie, puis on retrouve ou on
 * provisionne le compte (Person + UserAccount) à partir de l'email vérifié, et on
 * renvoie un JWT applicatif.
 */
@RestController
public class CustomSocialAuthenticationServiceFacade extends BaseAuthenticationServiceFacade {

    private static final String COM_KATAPPULT_PEOPLE_PARTY_PERSON = "com.katappult.people.Party/Person";
    private static final String TOKEN = "token";
    private static final String SEPARATOR = "@";

    private final GoogleIdTokenVerifier googleIdTokenVerifier;

    protected CustomSocialAuthenticationServiceFacade(AuthenticationManager authenticationManager, MyUserDetailsService jwtUserDetailsService, JWTTokenUtil jwtTokenUtil, ApplicationContext context, AuthenticationUtils authenticationUtils, RefreshTokenService refreshTokenService, GoogleIdTokenVerifier googleIdTokenVerifier) {
        super(authenticationManager, jwtUserDetailsService, jwtTokenUtil, context, authenticationUtils, refreshTokenService);
        this.googleIdTokenVerifier = googleIdTokenVerifier;
    }

    @PostMapping(value = "/api/pub/v1/custom-login/google")
    @Transactional
    public Serializable oauth2(@RequestBody Map<String, String> payload,
                               HttpServletRequest request,
                               HttpServletResponse response) throws GeneralSecurityException, IOException {
        String googleToken = payload.get("idToken");

        GoogleIdToken idToken = googleIdTokenVerifier.verify(googleToken);
        if (idToken != null) {
            GoogleIdToken.Payload tokenPayload = idToken.getPayload();

            String email = tokenPayload.getEmail();
            String name = (String) tokenPayload.get("name");

            String token = getAccessToken(email, name, request, response);

            return SuccessRestResponse
                    .newOne()
                    .withAttribute(TOKEN, token);
        }

        throw new IllegalArgumentException();
    }

    private String getAccessToken(String email, String name, HttpServletRequest request, HttpServletResponse response) {
        UserAccount account = services.principalsService().getAccountByLogin(email);
        if (account == null) {
            Person person = new Person();
            person.setFirstName(name);
            person.setLastName(name);
            person.setGender(1);
            person.setBirthDate(new Date());

            Container sourceContainer = services.containerService().getApplicationContainer();
            Type type = services.typeService().getTypeByLogicalPath(COM_KATAPPULT_PEOPLE_PARTY_PERSON, false);
            services.peopleService().personService()
                    .createPersonWithAccount(person, type.getLogicalPath(), email, sourceContainer);

            String nickName = email.split(SEPARATOR)[0];

            account = services.principalsService().getAccountByLogin(email);
            services.principalsService().setNickName(account, nickName);
            services.principalsService().updateAccountByInitPassword(account, UUID.randomUUID().toString(), account.getLockToken());
        }

        return finalizeAuthentication(request, account, false, response);
    }
}
