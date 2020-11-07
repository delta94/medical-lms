import React, {useState} from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "views/account/Login";
import UserTable from "views/manage/users/UserTable";
import ClientTable from "views/admin/clients/ClientTable";
import Account from "./views/account/Account";
import {AdminRoute, PrivateRoute, SuperUserRoute} from "./RouteGuards";
import GroupTable from "./views/manage/groups/GroupTable";
import {Navigation} from "./components/Navigation";
import {ManageClient} from "./views/admin/clients/ManageClient";
import {ManageGroup} from "./views/manage/groups/ManageGroup";
import ResourceTable from "./views/manage/resources/ResourceTable";
import {ManageResource} from "./views/manage/resources/ManageResource";
import {ManageUser} from "./views/manage/users/ManageUser";
import ViewResources from "./views/resources/ViewResources";
import ViewResource from "./views/resources/ViewResource";
import ManageFeatureFlags from "./views/admin/clients/ManageFeatureFlags";
import PatientsTable from "./views/manage/patients/PatientTable";
import {ManagePatient} from "./views/manage/patients/ManagePatient";
import NotFoundPage from "./views/NotFoundPage";
import ScenarioTable from "./views/manage/scenarios/ScenarioTable";
import {ManageScenario} from "./views/manage/scenarios/ManageScenario";
import SSOSettings from "views/settings/sso/SSOSettings";
import ViewScenarios from "./views/scenarios/ViewScenarios";
import {ViewFBC} from "./views/manage/patients/patientbloods/fbc/ViewFBC";
import {ViewBL12} from "./views/manage/patients/patientbloods/bl12/ViewBL12";
import {ViewBoneProfile} from "./views/manage/patients/patientbloods/boneprofile/ViewBoneProfile";
import {ViewCoagulation} from "./views/manage/patients/patientbloods/coagulation/ViewCoagulation";
import {ViewLFTS} from "./views/manage/patients/patientbloods/lfts/ViewLFTS";
import {ViewOther} from "./views/manage/patients/patientbloods/other/ViewOther";
import {ViewTFTS} from "./views/manage/patients/patientbloods/tfts/ViewTFTS";
import {ViewUES} from "./views/manage/patients/patientbloods/ues/ViewUES";
import {ClerkingInfoView} from "./views/manage/patients/ClerkingInfoView";
import ManageGraph from "./views/manage/scenarios/graph/ManageGraph";
import {ArterialBloodGasView} from "./views/manage/patients/ArterialBloodGasView";
import Scenario from "./views/Scenario";
import {Details} from "./views/settings/Details";
import {SetupU2F} from "./views/account/SetupU2F";
import {ViewMfaRecoveryCodes} from "./views/account/ViewMfaRecoveryCodes";
import {SetupTotp} from "./views/account/SetupTotp";

export default function Main(props) {
    const [sidebarState, setSidebarState] = useState(false);

    return (
        <BrowserRouter>
            <Navigation sidebarToggle={setSidebarState}/>
            <div className={sidebarState ? "content with-sidebar" : "content"}>
                <div className="container">
                    <Switch>
                        <Route path="/account/login">
                            <Login {...props} />
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/dashboard"/>
                        </Route>
                        <PrivateRoute exact path="/scenarios" component={ViewScenarios}/>
                        <PrivateRoute exact path="/scenarios/:scenarioId" component={Scenario}/>
                        <PrivateRoute exact path="/dashboard"><Redirect to="/scenarios"/></PrivateRoute>
                        <PrivateRoute exact path="/account/:page" component={Account}/>
                        <PrivateRoute exact path="/account/security/2fa/recovery-codes/:method"
                                      component={ViewMfaRecoveryCodes}/>
                        <PrivateRoute exact path="/account/security/2fa/u2f" component={SetupU2F}/>
                        <PrivateRoute exact path="/account/security/2fa/totp" component={SetupTotp}/>
                        <PrivateRoute exact path="/resources" component={ViewResources}/>
                        <PrivateRoute path="/resources/:resourceId" component={ViewResource}/>
                        <SuperUserRoute exact path="/manage/users" component={UserTable}/>
                        <SuperUserRoute path="/manage/users/:userId" component={ManageUser}/>
                        <SuperUserRoute exact path="/manage/groups" component={GroupTable}/>
                        <SuperUserRoute path="/manage/groups/:groupId" component={ManageGroup}/>
                        <SuperUserRoute exact path="/manage/resources" component={ResourceTable}/>
                        <SuperUserRoute path="/manage/resources/:resourceId" component={ManageResource}/>
                        <SuperUserRoute exact path="/manage/patients" component={PatientsTable}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId" component={ManagePatient}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/fbc" component={ViewFBC}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/bl12folate"
                                        component={ViewBL12}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/boneprofile"
                                        component={ViewBoneProfile}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/coagulation"
                                        component={ViewCoagulation}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/lfts" component={ViewLFTS}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/tfts" component={ViewTFTS}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/other"
                                        component={ViewOther}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/bloods/ues" component={ViewUES}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/clerking"
                                        component={ClerkingInfoView}/>
                        <SuperUserRoute exact path="/manage/patients/:patientId/abg" component={ArterialBloodGasView}/>

                        <SuperUserRoute exact path="/manage/scenarios" component={ScenarioTable}/>
                        <SuperUserRoute exact path="/manage/scenarios/:scenarioId" component={ManageScenario}/>
                        <SuperUserRoute exact path="/manage/scenarios/:scenarioId/graph" component={ManageGraph}/>
                        <SuperUserRoute exact path="/settings/details" component={Details}/>
                        <SuperUserRoute exact path="/settings/sso" component={SSOSettings}/>
                        <AdminRoute path="/admin/clients/:clientId/manage/users/:userId" component={ManageUser}/>
                        <AdminRoute exact path="/admin/clients/:clientId/manage/users" component={UserTable}/>
                        <AdminRoute path="/admin/clients/:clientId/manage/groups/:groupId" component={ManageGroup}/>
                        <AdminRoute exact path="/admin/clients/:clientId/manage/groups" component={GroupTable}/>
                        <AdminRoute path="/admin/clients/:clientId/manage/resources/:resourceId"
                                    component={ManageResource}/>
                        <AdminRoute exact path="/admin/clients/:clientId/manage/resources"
                                    component={ResourceTable}/>
                        <AdminRoute exact path="/admin/clients/:clientId/manage/patients/:patientId"
                                    component={ManagePatient}/>
                        <AdminRoute exact path="/admin/clients/:clientId/manage/patients"
                                    component={PatientsTable}/>
                        <SuperUserRoute path="/admin/clients/:clientId/manage/scenarios/:scenarioId/graph"
                                        component={ManageGraph}/>
                        <SuperUserRoute path="/admin/clients/:clientId/manage/scenarios/:scenarioId"
                                        component={ManageScenario}/>
                        <SuperUserRoute exact path="/admin/clients/:clientId/manage/scenarios"
                                        component={ScenarioTable}/>
                        <AdminRoute exact path="/admin/clients/:clientId/features" component={ManageFeatureFlags}/>
                        <AdminRoute path="/admin/clients/:clientId" component={ManageClient}/>
                        <AdminRoute exact path="/admin/clients" component={ClientTable}/>
                        <Route path="/404" component={NotFoundPage}/>
                        <Redirect to="/404"/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}
