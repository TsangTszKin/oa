/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/*
 * Assignment
 */
var KisBpmAssignmentCtrl = ['$scope', '$modal', function ($scope, $modal) {
	// Config for the modal window
  var opts = {
    template: 'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
    scope: $scope
  }

	// Open the dialog
  $modal(opts)
}]

var KisBpmAssignmentPopupCtrl = ['$scope', function ($scope) {
	// 回调函数
  function receiveMessageFromIndex (event) {
    console.log('我是iframe,我接受到了：', event.data)
    switch (event.data.code) {
      case 0:
        $scope.assignment.assignee = event.data.value[0].id
        $scope.assignment.assigneeName = event.data.value[0].label
        break
      case 1:

        var candidateUsers_temp = []
        var candidateUsersName_temp = []
        event.data.value.forEach(function (item) {
          candidateUsers_temp.push({
            value: item.id
          })
          candidateUsersName_temp.push(item.label)
        })
        $scope.assignment.candidateUsers = candidateUsers_temp
        $scope.assignment.candidateUsersName = candidateUsersName_temp.join(',')
        break
      case 2:
        var candidateGroups_temp = []
        var candidateGroupsName_temp = []
        event.data.value.forEach(function (item) {
          candidateGroups_temp.push({
            value: item.id
          })
          candidateGroupsName_temp.push(item.name)
        })
        $scope.assignment.candidateGroups = candidateGroups_temp
        $scope.assignment.candidateGroupsName = candidateGroupsName_temp.join(',')
        break
      default:
        break
    }
    $scope.$apply()
  }

	// 监听message事件
  window.addEventListener('message', receiveMessageFromIndex, false)

	// Put json representing assignment on scope
  if ($scope.property.value !== undefined && $scope.property.value !== null &&
		$scope.property.value.assignment !== undefined &&
		$scope.property.value.assignment !== null) {
    $scope.assignment = $scope.property.value.assignment
  } else {
    $scope.assignment = {}
  }

  $scope.assignment.assigneeName = ''

  if ($scope.assignment.candidateUsers == undefined || $scope.assignment.candidateUsers.length == 0) {
    $scope.assignment.candidateUsers = [{ value: '' }]
  }
  var candidateUsersArray = []
  $scope.assignment.candidateUsers.forEach(function (item) {
    candidateUsersArray.push(item.value)
  })
  $scope.assignment.candidateUsersName = candidateUsersArray.join(',')

	// Click handler for + button after enum value
  var userValueIndex = 1
  $scope.addCandidateUserValue = function (index) {
    $scope.assignment.candidateUsers.splice(index + 1, 0, { value: 'value ' + userValueIndex++ })
  }

	// Click handler for - button after enum value
  $scope.removeCandidateUserValue = function (index) {
    $scope.assignment.candidateUsers.splice(index, 1)
  }

  if ($scope.assignment.candidateGroups == undefined || $scope.assignment.candidateGroups.length == 0) {
    $scope.assignment.candidateGroups = [{ value: '' }]
  }

  var candidateGroupsArray = []
  $scope.assignment.candidateGroups.forEach(function (item) {
    candidateGroupsArray.push(item.value)
  })
  $scope.assignment.candidateGroupsName = candidateGroupsArray.join(',')

  var groupValueIndex = 1
  $scope.addCandidateGroupValue = function (index) {
    $scope.assignment.candidateGroups.splice(index + 1, 0, { value: 'value ' + groupValueIndex++ })
  }

	// Click handler for - button after enum value
  $scope.removeCandidateGroupValue = function (index) {
    $scope.assignment.candidateGroups.splice(index, 1)
  }

  $scope.save = function () {
    $scope.property.value = {}
    handleAssignmentInput($scope)
    $scope.property.value.assignment = $scope.assignment

    $scope.updatePropertyInModel($scope.property)
    $scope.close()
  }

	// Close button handler
  $scope.close = function () {
    handleAssignmentInput($scope)
    $scope.property.mode = 'read'
    $scope.$hide()
  }

  $scope.assigneeFieldPicker = function () {
    parent.postMessage(JSON.stringify({ code: 3, value: '' }), '*') // window.postMessage
  }

  $scope.userFieldPicker = function () {
    parent.postMessage(JSON.stringify({ code: 4, value: '' }), '*') // window.postMessage
  }

  $scope.groupFieldPicker = function () {
    parent.postMessage(JSON.stringify({ code: 5, value: '' }), '*') // window.postMessage
  }

  var handleAssignmentInput = function ($scope) {
    if ($scope.assignment.candidateUsers) {
      var emptyUsers = true
      var toRemoveIndexes = []
      for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
        if ($scope.assignment.candidateUsers[i].value != '') {
          emptyUsers = false
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateUsers.splice(toRemoveIndexes[i], 1)
      }

      if (emptyUsers) {
        $scope.assignment.candidateUsers = undefined
      }
    }

    if ($scope.assignment.candidateGroups) {
      var emptyGroups = true
      var toRemoveIndexes = []
      for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
        if ($scope.assignment.candidateGroups[i].value != '') {
          emptyGroups = false
        } else {
          toRemoveIndexes[toRemoveIndexes.length] = i
        }
      }

      for (var i = 0; i < toRemoveIndexes.length; i++) {
        $scope.assignment.candidateGroups.splice(toRemoveIndexes[i], 1)
      }

      if (emptyGroups) {
        $scope.assignment.candidateGroups = undefined
      }
    }
  }
}]
